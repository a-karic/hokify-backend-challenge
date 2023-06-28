import { IUpdateObjectInput } from "../utils/interfaces";
import { sanitizeInput } from "./../utils/sanitizeInput";

describe("sanitizeInput", () => {
    it("should sanitize a valid input object", () => {
      // Given a valid input object
      const input: IUpdateObjectInput = {
        name: "John Doe",
        age: 25,
        email: "john.doe@example.com",
      };
  
      // When the sanitizeInput function is called with the input object
      const output = sanitizeInput(input);
  
      // Then the output object should be equal to the input object
      expect(output).toEqual(input);
    });
  
    // Define a test case for an invalid input object
    it("should sanitize an invalid input object", () => {
      // Given an invalid input object with non-alphanumeric characters in the keys and values
      const input: IUpdateObjectInput = {
        "name!": "John Doe",
        "age?": 25,
        "email@": "john.doe@example.com",
        "$address": {
          "street#": "123 Main St.",
          "city*": "New York",
          "zip%": 10001,
        },
      };
  
      // When the sanitizeInput function is called with the input object
      const output = sanitizeInput(input);
  
      // Then the output object should have the non-alphanumeric characters removed from the keys and values
      expect(output).toMatchObject({
        name: "John Doe",
        age: 25,
        email: "john.doe@example.com",
        address: {
          street: "123 Main St.",
          city: "New York",
          zip: 10001,
        },
      });
    })
});