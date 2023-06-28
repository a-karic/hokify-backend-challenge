import { IUpdateObjectInput } from "./interfaces";
import { removeInvalidCharsForObjectKey } from "./removeInvalidCharsForObjectKey";
import { sanitizeInputValue } from "./sanitizeInputValue";

/**
 * Sanitizes the input object by removing any invalid characters from the keys and values.
 * @param input The input object to be sanitized.
 * @returns A new object with sanitized keys and values.
 * @example
 * // Input object with valid keys and values
 * const input = {
 *   name: "John Doe",
 *   age: 25,
 *   email: "john.doe@example.com",
 * };
 *
 * // Output object with valid keys and values
 * const output = sanitizeInput(input);
 * output = {
 *   name: "John Doe",
 *   age: 25,
 *   email: "john.doe@example.com",
 * };
 *
 * @example
 * // Input object with invalid characters in the keys and values
 * const input = {
 *   "name!": "John Doe",
 *   "age?": 25,
 *   "email@": "john.doe@example.com",
 *   "$address": {
 *     "street#": "123 Main St.",
 *     "city*": "New York",
 *     "zip%": 10001,
 *   },
 * };
 *
 * // Output object with sanitized keys and values
 * const output = sanitizeInput(input);
 * output = {
 *   name: "John Doe",
 *   age: 25,
 *   email: "john.doe@example.com",
 *   address: {
 *     street: "123 Main St.",
 *     city: "New York",
 *     zip: 10001,
 *   },
 * };
 */
export const sanitizeInput = (input: IUpdateObjectInput): IUpdateObjectInput => {
  // Create a new object to store the sanitized input
  const sanitizedInput: IUpdateObjectInput = {};

  // Loop through each key and value in the input object
  for (const key in input) {

    // Sanitize the key by removing any non-alphanumeric characters except [ ] .
    const sanitizedKey = removeInvalidCharsForObjectKey(key);

    // Sanitize the value by calling the sanitizeInputValue function
    const sanitizedValue = sanitizeInputValue(input[key]);

    // Assign the sanitized key and value to the new object
    sanitizedInput[sanitizedKey] = sanitizedValue;
  }

  // Return the new object
  return sanitizedInput;
};