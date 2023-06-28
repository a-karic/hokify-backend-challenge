import { sanitizeInputValue } from "../utils/sanitizeInputValue";

describe("sanitizeInputValue", () => {
  // Test the case when the value is null or undefined
  it("should return null or undefined when the value is null or undefined", () => {
    // Given: a null or undefined value
    const value = null;

    // When: the function is called with the value
    const result = sanitizeInputValue(value);

    // Then: the result should be the same as the value
    expect(result).toBe(value);
  });

  // Test the case when the value is a string
  it("should sanitize the string value using DOMPurify", () => {
    // Given: a string value with some HTML tags
    const value = "<script>alert('Hello')</script>";

    // When: the function is called with the value
    const result = sanitizeInputValue(value);

    // Then: the result should be a empty string, since everything in <script> tag shoud be ignored
    expect(result).toBe("");
  });

  // Test the case when the value is a number
  it("should return the number value as is", () => {
    // Given: a number value
    const value = 42;

    // When: the function is called with the value
    const result = sanitizeInputValue(value);

    // Then: the result should be the same as the value
    expect(result).toBe(value);
  });

  // Test the case when the value is an object
  it("should sanitize each property of the object recursively", () => {
    // Given: an object value with some nested properties
    const value = {
      name: "<b>John</b>",
      age: 25,
      address: {
        city: "<i>London</i>",
        zip: 12345,
      },
    };

    // When: the function is called with the value
    const result = sanitizeInputValue(value);

    // Then: the result should be an object with sanitized properties
    expect(result).toEqual({
      name: "John",
      age: 25,
      address: {
        city: "London",
        zip: 12345,
      },
    });
  });

  // Test the case when the value is not a valid input type
  it("should return null when the value is not a valid input type", () => {
    // Given: a value that is not a string, number, object, null or undefined
    const value = true;

    // When: the function is called with the value
    const result = sanitizeInputValue(value);

    // Then: the result should be null
    expect(result).toBeNull();
  });
});