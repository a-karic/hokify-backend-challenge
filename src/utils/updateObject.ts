import { sanitizeInput } from './sanitizeInput';

import { 
  ICustomObject, 
  ICustomObjectWithID, 
  IUpdateObjectInput, 
  IUpdateObjectInputValue,
  IId,
} from './interfaces';

/**
 * Updates an object with the given input values according to the following specs:
 * 
 * - Normal objects are just specified by the key. 
 * - Keys are separated by "." e.g. root.path.subpath is referring to: { root: { path: { subpath: <>} } }
 * - Array entries can be specified by their root object (e.g. cvInfo.experiences: [..]) or by specifying a [ ] at the end. 
 * - If the value between [ ] is empty, it means adding a new entry, if there is value inside [ ], look for the entry with the corresponding _id. (fallback, if _id is a number, use it as index - not needed right now) 
 * - If a key is specified without a value (null / undefined), remove the entry. For arrays: remove this entry, for other objects just unset the value.  
 * - If a path does not exist, create it.. depending on the specified path as object or as array.
 * 
 * @param {ICustomObject} object - The original object to be updated
 * @param {IUpdateObjectInput} input - An object containing the keys and values to be updated
 * @returns {ICustomObject} A new object with the updated values
 * 
 * @example
 * // Example 1: Update an existing key of an object
 * updateObject({name: "John"}, {name: "Jane"}) // returns {name: "Jane"}
 * 
 * @example
 * // Example 2: Remove an existing key of an object
 * updateObject({name: "John", age: 25}, {age: null}) // returns {name: "John"}
 * 
 * @example
 * // Example 3: Add a new key to an object
 * updateObject({name: "John"}, {age: 25}) // returns {name: "John", age: 25}
 * 
 * @example
 * // Example 4: Update an existing element of an array by _id
 * updateObject({skills: [{_id: "a", name: "Java"}, {_id: "b", name: "Python"}]}, {"skills[a]": {name: "JavaScript"}}) // returns {skills: [{_id: "a", name: "JavaScript"}, {_id: "b", name: "Python"}]}
 *
 * @example
 * // Example 5: Remove an existing element of an array by _id
 * updateObject({skills: [{_id: "a", name: "Java"}, {_id: "b", name: "Python"}]}, {"skills[a]": null}) // returns {skills: [{_id: "b", name: "Python"}]}
 *
 * @example
 * // Example 6: Add a new element to an array
 * updateObject({skills: [{_id: "a", name: "Java"}, {_id: "b", name: "Python"}]}, {"skills[]": {_id:"c", name:"C++"}}) // returns {skills:[{_id:"a",name:"Java"},{_id:"b",name:"Python"},{_id:"c",name:"C++"}]}
 *
 * @example
 * // Example 7: Remove all elements from an array
 * updateObject({skills:[{_id:"a",name:"Java"},{_id:"b",name:"Python"}]},{"skills[]":null}) // returns {skills:[ ]}
 *
 * @example
 * // Example 8: Create a new path if it does not exist
 * updateObject({}, {"root.path.subpath": 42}) // returns {root:{path:{subpath :42}}}
 */
export const updateObject = (object: ICustomObject, input: IUpdateObjectInput): ICustomObject => {

  // Sanitize input to prevent any kind of attack (XSS, SQL injection.. etc)
  const sanitizedInput = sanitizeInput(input);

  // Make a copy of the object to avoid mutating the original
  const updatedObject = JSON.parse(JSON.stringify(object));

  // Loop through the input keys
  for (const key of Object.keys(sanitizedInput)) {
    const segments = key.split(".");
    const lastSegment = segments[segments.length - 1];
    const inputValue = sanitizedInput[key];
    const match = lastSegment.match(/\[(\d*|.*)\]/);
    const pointer = findOrCreatePointer(key, updatedObject);

    // Guard clause for modifying an array segment
    if (match) {
      modifyArraySegment(lastSegment, match, pointer, inputValue);
      continue;
    }

    // Guard clause for removing a key from the object
    if (inputValue == null) {
      delete pointer[lastSegment];
      continue;
    }

    // Default case for updating a key of the object
    pointer[lastSegment] = inputValue as ICustomObject;
  }

  // Return the updated object
  return updatedObject;
};

const removeIdFromSegment = (segment: string) => segment.substring(0, segment.indexOf("["));

const modifyArraySegment = (segmentName: string, arrayMatch: RegExpMatchArray, pointer: ICustomObject, inputValue: IUpdateObjectInputValue) => {
  // Get the index or _id from the segment match array or the segment value
  const indexOrId = arrayMatch[1] || (inputValue ? (inputValue as ICustomObjectWithID)["_id"] : null) as IId;
  // Get the segment name without the id
  const segmentWithoutId = segmentName.substring(0, segmentName.indexOf("["));

  // Initialize the array if it does not exist
  pointer[segmentWithoutId] = pointer[segmentWithoutId] || [];
  // Get the array from the object pointer
  const array = pointer[segmentWithoutId] as ICustomObjectWithID[];

  // Guard clause for removing all elements from the array
  if (inputValue == null && !indexOrId) {
    removeAllElements(array);
    return;
  }

  // Guard clause for removing an element from the array
  if (inputValue == null && indexOrId) {
    removeElement(array, indexOrId);
    return;
  }

  // Guard clause for updating an element in the array
  if (indexOrId) {
    updateElement(array, indexOrId, inputValue);
    return;
  }

  // Default case for adding an element to the array
  addElement(array, inputValue);
};

const removeAllElements = (array: ICustomObjectWithID[]) => {
  // Remove all elements from the array
  array.length = 0;
};

const removeElement = (array: ICustomObjectWithID[], indexOrId: IId) => {
  // Find and remove the element with the matching _id or index
  const l = array.length;
  for (let i = 0; i < l; i++) {
    if (array[i]._id === indexOrId || array[i]._id === Number(indexOrId)) {
      array.splice(i, 1);
      return;
    }
  }
  // Throw an error if no matching element is found
  throw new Error(`Invalid array index or _id: ${indexOrId}`);
};

const updateElement = (array: ICustomObjectWithID[], indexOrId: IId, inputValue: IUpdateObjectInputValue) => {
  // Find and update the element with the matching _id or index
  const l = array.length;
  for (let i = 0; i < l; i++) {
    if (array[i]._id === indexOrId || array[i]._id === Number(indexOrId)) {
      const newEntry = {_id: array[i]._id };
      Object.assign(newEntry, inputValue);
      array[i] = newEntry;
      return;
    }
  }
  // Create and push a new entry if no matching element is found
  const newEntry: ICustomObjectWithID = {
    _id: indexOrId,
    ...(inputValue as Record<string, unknown>),
  };
  array.push(newEntry);
};

const addElement = (array: ICustomObjectWithID[], inputValue: IUpdateObjectInputValue) => {
   if (typeof inputValue == "string") {
    // Push a string value to the array
    array.push(inputValue as unknown as ICustomObjectWithID);
   } else {
    // Create and push a new entry with a random _id and the input value
    const newEntry: ICustomObjectWithID = {
      _id: Math.random().toString(36).substr(2),
      ...(inputValue as Record<string, unknown>),
    };
    array.push(newEntry);
   }
};

const findOrCreatePointer = (key: string, updatedObject: ICustomObject) => {
  // Split the key by "." to get the path segments
  const segments = key.split(".");

  // Initialize a pointer to the current level of the object
  let pointer = updatedObject;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];

    // Check if the segment is an array index or an array entry with _id
    const match = segment.match(/\[(\d+|.+)\]/);

    if (match) {
      // Update the pointer to point to the array entry
      pointer = findArrayEntry(pointer, segment, match);
    } else {
      // Update the pointer to point to the new object or array
      pointer = findOrCreateObjectOrArray(pointer, segment, segments[i + 1]);
    }
  }

  return pointer;
};

const findArrayEntry = (
  pointer: ICustomObject,
  segment: string,
  match: RegExpMatchArray
) => {
  // Get the array index or _id from the match
  const [ , indexOrId ] = match; // use destructuring assignment

  // Get the array from the pointer
  const array = pointer[removeIdFromSegment(segment)] as ICustomObjectWithID[];

  // Find the array entry with the matching _id or index
  const entry = array.find(
    (item) => item._id === indexOrId || item._id === Number(indexOrId)
  );

  // If the entry is not found, throw an error and exit early
  if (!entry) {
    throw new Error(`Invalid array index or _id: ${indexOrId}`);
  }

  return entry;
};

const findOrCreateObjectOrArray = (
  pointer: ICustomObject,
  segment: string,
  nextSegment: string
) => {
  // Get the value from the pointer by the key
  let value = pointer[segment];

  // If the value does not exist, create a new object or array depending on the next segment
  if (!value) {
    // Check if the next segment is an array index or an array entry with _id
    value = nextSegment.match(/\[\d*|.+\]/)
      ? [] // use object literal for array
      : {}; // use object literal for object

    // Assign the new object or array to the pointer by the key
    pointer[segment] = value;
  }

  return value as ICustomObject;
};