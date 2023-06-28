/**
 * Removes any invalid characters for an object key from a given string.
 * Invalid characters are anything other than alphanumeric characters, square brackets, dot and underscore.
 * @param {string} str - The string to be processed.
 * @returns {string} The processed string with invalid characters removed.
 * @example
 * removeInvalidCharsForObjectKey("foo.bar") // returns "foo.bar"
 * removeInvalidCharsForObjectKey("foo[bar]") // returns "foo[bar]"
 * removeInvalidCharsForObjectKey("foo-bar") // returns "foobar"
 * removeInvalidCharsForObjectKey("foo bar") // returns "foobar"
 */
export const removeInvalidCharsForObjectKey = (str: string): string => {
  // Use the replace method with a regular expression to replace the invalid characters with an empty string
  return str.replace(/[^a-zA-Z0-9\[\]\._]/g, "");
};