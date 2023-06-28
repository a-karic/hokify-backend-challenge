// Import the interfaces for input
import sanitizeHtml from 'sanitize-html';
import { removeInvalidCharsForObjectKey } from './removeInvalidCharsForObjectKey';
import { IUpdateObjectInputValue } from './interfaces';

/**
 * Sanitizes the input value to prevent XSS attacks.
 * @param value The input value to sanitize. It can be null, undefined, string, number or object.
 * @returns The sanitized value of the same type as the input, or null if the input is not valid.
 * @example
 * sanitizeInputValue(null) // returns null
 * sanitizeInputValue(42) // returns 42
 * sanitizeInputValue("<script>alert('hello')</script>") // returns ""
 * sanitizeInputValue({name: "Alice", age: 25}) // returns {name: "Alice", age: 25}
 * sanitizeInputValue([1, 2, "<b>3</b>"]) // returns [1, 2, "3"]
 */
export const sanitizeInputValue = (value: IUpdateObjectInputValue | unknown): IUpdateObjectInputValue => {
  // If the value is null or undefined, return it as is
  if (value == null) return value;

  // If the value is a string, use DOMPurify to sanitize it
  if (typeof value === "string") {
    return sanitizeHtml(
        value, 
        {
            allowedTags: [],
        }
    );
  }

  // If the value is a number, return it as is
  if (typeof value === "number") return value;

  // If the value is an object, sanitize each property recursively
  if (typeof value === "object") {
    const sanitizedObject: Record<string, unknown> = {};

    for (const key in value) {
      const sanitizedKey = removeInvalidCharsForObjectKey(key);
      sanitizedObject[sanitizedKey] = sanitizeInputValue(value[key]);
    }

    return sanitizedObject;
  }

  // Otherwise, return null
  return null;
};