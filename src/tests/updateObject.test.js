import { updateObject } from "./../utils/updateObject";

/**
 * Specs
 * 
 * Normal objects, are just specified by the key. 
 * Keys are seperated by "." e.g. root.path.subpath is referring to: { root: { path: { subpath: <>} } }
 * Array entries, can be specified by their root object (e.g. cvInfo.experiences: [..]) or by specifing a [ ] at the end. 
 * If the value between [ ] is empty, it means adding a new entry, if there is value inside [ ], look for the entry with the corresponding _id. (fallback, if _id is a number, use it as index - not needed right now) 
 * if a key is specified without a value (null / undefined), remove the entry. for arrays: remove this entry, for other objects just unset the value.  
 * if a path does not exist, create it.. depending on the specified path as object or as array. (see example 8) write one function that can handle all cases (and passes the pre defined tests) all input and output objects of the functions are JS objects
 */

describe('updateObject function', () => {
  
  it('should update element of object by string path root.path.subpath', () => {
     // Given
     const object = {
      root: {
        path: {
          subpath: 'oldValue',
        },
      },
    };

    const input = {
      'root.path.subpath': 'newValue',
    };

    const expected = {
      root: {
        path: {
          subpath: 'newValue',
        },
      },
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should update element of array by string path root.path.array[]', () => {
    // Given
    const object = {
      root: {
        path: {
          array: [
            { _id: 1, value: 'oldValue1' },
            { _id: 2, value: 'oldValue2' },
          ],
        },
      },
    };

    const input = {
      'root.path.array[]': { _id: 1, value: 'newValue' },
    };

    const expected = {
      root: {
        path: {
          array: [
            { _id: 1, value: 'newValue' },
            { _id: 2, value: 'oldValue2' },
          ],
        },
      },
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should update element of array by string path root.path.array[_id]', () => {
    // Given
    const object = {
      root: {
        path: {
          array: [
            { _id: 'id1', value: 'oldValue1' },
            { _id: 'id2', value: 'oldValue2' },
          ],
        },
      },
    };

    const input = {
      'root.path.array[id2]': { value: 'newValue' },
    };

    const expected = {
      root: {
        path: {
          array: [
            { _id: 'id1', value: 'oldValue1' },
            { _id: 'id2', value: 'newValue' },
          ],
        },
      },
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should remove element of object by string path root.path.subpath with null value', () => {
    // Given
    const object = {
      root: {
        path: {
          subpath: 'oldValue',
        },
      },
    };

    const input = {
      'root.path.subpath': null,
    };

    const expected = {
      root: {
        path: {},
      },
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should remove element of array by string path root.path.array[] with null value', () => {
    // Given
    const object = {
      root: {
        path: {
          array: [
            { _id: 1, value: 'value1' },
            { _id: 2, value: 'value2' },
          ],
        },
      },
    };

    const input = {
      'root.path.array[]': null,
    };

    const expected = {
      root: {
        path: {
          array: [],
        },
      },
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should create element of object by string path root.path.subpath if it does not exist', () => {
    // Given
    const object = {
      root: {
        path: {},
      },
    };

    const input = {
      'root.path.subpath': 'value',
    };

    const expected = {
      root: {
        path: {
          subpath: 'value',
        },
      },
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should create element of array by string path root.path.array[] if it does not exist', () => {
    // Given
    const object = {
      root: {
        path: {},
      },
    };

    const input = {
      'root.path.array[]': { _id: 'id1', value: 'newValue' },
    };

    const expected = {
      root: {
        path: {
          array: [{ _id: 'id1', value: 'newValue' }],
        },
      },
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

});

describe('updateObject function - tests from Hokify', () => {
  let object;

  beforeEach(() => {
    object = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      value: 'hui',
    };
  });

  it('should update element of array by string path a.b[_id] and overwrite the whole object except _id', () => {
    // Given
    const input = {
      'a.b[5dc0ad700000000000000000]': { title: 'asdf1-updated' },
    };

    const expected = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', title: 'asdf1-updated' }, // name got removed, all other objects got overwritten, _id is still automatically applied though
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      value: 'hui',
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should update element of array by string path a.b[_id].titleValue and add or overwrite the value', () => {
    // Given
    const input = {
      'a.b[5dc0ad700000000000000000].titleValue': 'asdf1-updated',
    };

    const expected = {
      a: {
        b: [
          {
            _id: '5dc0ad700000000000000000',
            name: 'asdf1',
            titleValue: 'asdf1-updated',
          }, // titleValue got added / overwritten (if it was there already). all other values remain the same
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      value: 'hui',
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should add an element to array by string path a.b[] with a new object', () => {
    // Given
    const input = {
      'a.b[]': { _id: '5dc0ad700000000000000003', name: 'co2' },
    };

    const expected = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
          { _id: '5dc0ad700000000000000003', name: 'co2' }, // this entry has been added
        ],
      },
      value: 'hui',
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should remove an element from array by string path a.b[_id] with null value', () => {
    // Given
    const input = {
      'a.b[5dc0ad700000000000000001]': null,
    };

    const expected = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          // asdf2- id has been removed
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      value: 'hui',
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should add a regular object value by string path a.c', () => {
    // Given
    const input = {
      'a.c': 'hallo',
    };

    const expected = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
        c: 'hallo', // <-- this property has been added
      },
      value: 'hui',
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should update a regular object value by string path a.c', () => {
    // Given
    const input = {
      'a.c': 'hallo-changed',
    };

    const expected = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
        c: 'hallo-changed', // <-- this property has been updated
      },
      value: 'hui',
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should unset a regular object value on root level by string path value with null value', () => {
    // Given
    const input = {
      value: null,
    };

    const expected = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      // value is not here anymore
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should unset a regular object value NOT on root level by string path a.b with null value', () => {
    // Given
    const input = {
      'a.b': null,
    };

    const expected = {
      a: {
        // b is not here anymore
      },
      value: 'hui',
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should apply multiple operations at one time by string paths with different values', () => {
    // Given
    const input = {
      value: null,
      something: 'anything',
      'a.c': 'hallo',
    };

    const expected = {
      a: {
        c: 'hallo', // 3. a.c is set to hallo
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      something: 'anything', // 2. something with value anything
      // 1. value has been removed
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);
  });

  it('should apply array update and create underlying array or object by string paths with different values', () => {
    // Given
    const input = {
      'x[]': 'asdfX',
      'v.x[]': 'asdfV',
      'v.m.l': 'asdf-val',
    };

    const expected = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      x: ['asdfX'], // empty array x has been created, and asdfX has been added.
      v: {
        // v has been automatically created as object
        x: ['asdfV'], // underlying x has been created as array
        m: {
          // m has been created automatically as object
          l: 'asdf-val', // value of l has been set to asdf-val
        },
      },
      value: 'hui',
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toMatchObject(expected);

  });

  it('should update the images object by string path images with a new object', () => {
    // Given
    const input = {
      images: {
        thumbnail:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        small:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        medium:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        large:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        xlarge:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
      },
    };

    const expected = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      value: 'hui',
      images: {
        thumbnail:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        small:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        medium:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        large:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        xlarge:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
      },
    };

    // When
    const result = updateObject(object, input);

    // Then
    expect(result).toEqual(expected);

    // Given
    const inputThumbnailChanged = {
      'images.thumbnail':
        'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304828.jpg',
    };

    const expectedThumbnailChanged = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      value: 'hui',
      images: {
        thumbnail:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304828.jpg',
        small:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        medium:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        large:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
        xlarge:
          'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg',
      },
    };

    // When
    const resultThumbnailChanged = updateObject(result, inputThumbnailChanged);

    // Then
    expect(resultThumbnailChanged).toMatchObject(expectedThumbnailChanged);

    // Given
    const inputDeleteImages = {
      images: null,
    };

    const expectedDeleteImages = {
      a: {
        b: [
          { _id: '5dc0ad700000000000000000', name: 'asdf1' },
          { _id: '5dc0ad700000000000000001', name: 'asdf2' },
          { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ],
      },
      value: 'hui',
      // images is not here anymore
    };

    // When
    const resultDeleteImages = updateObject(resultThumbnailChanged, inputDeleteImages);

    // Then
    expect(resultDeleteImages).toEqual(expectedDeleteImages);
  });

});

describe("updateObject function - security", () => {

  // Check if the input contains any malicious code or data
  it("should sanitize or reject the input if it contains any malicious content", () => {
    // Given: an input with malicious content
    const maliciousInput = {"name": "<script>alert('XSS')</script>"};

    // When: calling the function with the malicious input
    const output = updateObject({}, maliciousInput);

    // Then: expect the output to be sanitized or rejected
    expect(output.name).not.toEqual(maliciousInput.name); // sanitized
  });

  // Check if the input contains any HTML tags
  it("should sanitize or reject the input if it contains any HTML tags", () => {
    // Given: an input with HTML tags
    const htmlInput = {"name": "<script>alert('XSS')</script>"};

    // When: calling the function with the HTML input
    const output = updateObject({}, htmlInput);

    // Then: expect the output to be sanitized or rejected
    expect(output.name).not.toEqual(htmlInput.name); // sanitized
  });

  // Check if the input contains any URLs
  it("should sanitize or reject the input if it contains any URLs", () => {
    // Given: an input with URLs
    const urlInput = {"name": "http://example.com/?q=<script>alert('XSS')</script>"};

    // When: calling the function with the URL input
    const output = updateObject({}, urlInput);

    // Then: expect the output to be sanitized or rejected
    expect(output.name).not.toEqual(urlInput.name); // sanitized
  });
});