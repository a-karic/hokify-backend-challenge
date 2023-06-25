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
    // TODO impl using given/when/then
  });

  it('should update element of array by string path root.path.array[]', () => {
    // TODO impl using given/when/then
  });

  it('should update element of array by string path root.path.array[_id]', () => {
    // TODO impl using given/when/then
  });

  it('should remove element of object by string path root.path.subpath with null value', () => {
    // TODO impl using given/when/then
  });

  it('should remove element of array by string path root.path.array[] with null value', () => {
    // TODO impl using given/when/then
  });

  it('should create element of object by string path root.path.subpath if it does not exist', () => {
    // TODO impl using given/when/then
  });

  it('should create element of array by string path root.path.array[] if it does not exist', () => {
    // TODO impl using given/when/then
  });

  // Cases from https://gist.github.com/simllll/a130e1c81c66ab1a3c3cdb51025f95df#file-hokify-backend-coding-challenge1-md
  it('should update element of array by string path a.b[_id] and overwrite the whole object except _id', () => {
    // TODO impl using given/when/then
  });

  it('should update element of array by string path a.b[_id].element and add or overwrite the nested value', () => {
    // TODO impl using given/when/then
  });

  it('should add a new element to array by string path a.b[] with _id and name', () => {
    // TODO impl using given/when/then
  });

  it('should remove element of array by string path a.b[_id] with null value', () => {
    // TODO impl using given/when/then
  });
  
  it('should add a new value to object by string path a.c with "hallo"', () => {
    // TODO impl using given/when/then
  });

  it('should update value of object by string path a.c with "hallo-changed"', () => {
    // TODO impl using given/when/then
  });

  it('should remove value of object by string path value with null value', () => {
    // TODO impl using given/when/then
  });

  it('should remove value of object by string path a.b with null value', () => {
    // TODO impl using given/when/then
  });

  it('should apply multiple updates by string paths value, seperated by ","', () => {
    // TODO impl using given/when/then
  });

  it('should create new paths in object or array by string paths x[], v.x[] and v.m.l with "asdfX", "asdfV" and "asdf-val" values', () => {
    // TODO impl using given/when/then
  });

  it('should update value of object by string path images with new image urls', () => {
    // TODO impl using given/when/then
  });
});
