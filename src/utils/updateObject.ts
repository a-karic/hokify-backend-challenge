export type IUpdateObjectInput = Record<string, string | number | null | undefined | Record<string, unknown>>;

export interface CustomObject {
    [x: string]: string | number | CustomObject | CustomObjectWithID[] | undefined;
}

export interface CustomObjectWithID extends CustomObject {
    "_id"?: string | number;
}

export const updateObject = (object: CustomObject, input: IUpdateObjectInput): CustomObject => {

  // Make a copy of the object to avoid mutating the original
  const updatedObject = JSON.parse(JSON.stringify(object));

  // Loop through the input keys
  for (const key of Object.keys(input)) {
    // Split the key by "." to get the path segments
    const segments = key.split(".");

    // Initialize a pointer to the current level of the object
    let pointer = updatedObject;

    // Loop through the segments except the last one
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];

      // Check if the segment is an array index or an array entry with _id
      const match = segment.match(/\[(\d+|.+)\]/);

      if (match) {
        // Get the array index or _id from the match
        const indexOrId = match[1];

      // Get segment without id
      const segmentWithoutId = segment.substring(0, segment.indexOf("["));

        // Get the array from the pointer
        const array = pointer[segmentWithoutId] as CustomObjectWithID[];

        // Check if the index or _id is valid
        if (indexOrId) {
          // Find the array entry with the matching _id or index
          const entry = array.find(
            (item) => item._id === indexOrId || item._id === Number(indexOrId)
          );

          // If the entry is found, update the pointer to point to it
          if (entry) {
            pointer = entry;
          } else {
            // If the entry is not found, throw an error
            throw new Error(`Invalid array index or _id: ${indexOrId}`);
          }
        } else {
          // If the index or _id is empty, it means adding a new entry to the array
          // Create a new entry with a random _id and an empty value
          const newEntry: CustomObjectWithID = {
            _id: Math.random().toString(36).substr(2),
            value: "",
          };

          // Push the new entry to the array
          array.push(newEntry);

          // Update the pointer to point to the new entry
          pointer = newEntry;
        }
      } else {
        // If the segment is not an array index or an array entry with _id, it is a normal object key
        // Get the value from the pointer by the key
        const value = pointer[segment];

        // Check if the value exists
        if (value) {
          // If the value exists, update the pointer to point to it
          pointer = value as CustomObject;
        } else {
          // If the value does not exist, create a new object or array depending on the next segment
          const nextSegment = segments[i + 1];

          // Check if the next segment is an array index or an array entry with _id
          if (nextSegment.match(/\[\d*|.+\]/)) {
            // If yes, create a new array and assign it to the pointer by the key
            pointer[segment] = [];
          } else {
            // If no, create a new object and assign it to the pointer by the key
            pointer[segment] = {};
          }

          // Update the pointer to point to the new object or array
          pointer = pointer[segment] as CustomObject;
        }
      }
    }

    // Get the last segment of the key
    const lastSegment = segments[segments.length - 1];

    // Get the input value by the key
    const inputValue = input[key];

    // Check if the last segment is an array index or an array entry with _id
    const match = lastSegment.match(/\[(\d*|.*)\]/);

    if (match) {
      // Get the array index or _id from the match
      const indexOrId = match[1] || (inputValue ? inputValue["_id"] : null);

      // Get segment without id
      const segmentWithoutId = lastSegment.substring(0, lastSegment.indexOf("["));

      if (!pointer[segmentWithoutId]) {
        pointer[segmentWithoutId] = [];
      }

      // Get the array from the pointer
      const array = pointer[segmentWithoutId] as CustomObjectWithID[];

      // Check if the input value is null or undefined
      if (inputValue == null) {
        // If yes, it means removing an element from the array

        // Check if the index or _id is valid
        if (indexOrId) {
          // Find the index of the array entry with the matching _id or index
          const entryIndex = array.findIndex(
            (item) => item._id === indexOrId || item._id === Number(indexOrId)
          );

          // If the entry index is found, remove it from the array
          if (entryIndex > -1) {
            array.splice(entryIndex, 1);
          } else {
            // If the entry index is not found, throw an error
            throw new Error(`Invalid array index or _id: ${indexOrId}`);
          }
        } else {
          // If the index or _id is empty, it means removing all elements from the array
          array.length = 0;
        }
      } else {
        // If no, it means updating an element of the array

        // Check if the index or _id is valid
        if (indexOrId) {
          // Find the array entry with the matching _id or index
          const entry = array.find(
            (item) => item._id === indexOrId || item._id === Number(indexOrId)
          );

          // If the entry is found, update it with the input value
          if (entry) {
            const index = array.indexOf(entry);
            const newEntry = {_id: entry._id };

            Object.assign(newEntry, inputValue);
            array[index] = newEntry;
          } else {
            const newEntry: CustomObjectWithID = {
                _id: indexOrId,
                ...(inputValue as Record<string, unknown>),
            };

            // Push the new entry to the array
            array.push(newEntry);
          }

        } else if (typeof inputValue == "string") {
          array.push(inputValue as unknown as CustomObjectWithID);

        } else {
          // If the index or _id or array is empty, it means adding a new element to the array
          // Create a new entry with a random _id and the input value
          const newEntry: CustomObjectWithID = {
            _id: Math.random().toString(36).substr(2),
            ...(inputValue as Record<string, unknown>),
          };

          // Push the new entry to the array
          array.push(newEntry);
        }
      }
    } else {
      // If the last segment is not an array index or an array entry with _id, it is a normal object key

      // Check if the input value is null or undefined
      if (inputValue == null) {
        // If yes, it means removing a key from the object
        delete pointer[lastSegment];
      } else {
        // If no, it means updating a key of the object
        pointer[lastSegment] = inputValue;
      }
    }
  }

  // Return the updated object
  return updatedObject;
};