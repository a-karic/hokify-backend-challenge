# Setup

1. `npm install` – install dependencies
2. `npm test` – run all tests (this will be used to evaluate your solutions)
3. `npm run test:watch` – run all tests in _watch mode_ (alternative to `npm test` which you might find more convenient to use locally)
4. `npm start` – (optional) serve the application locally at [http://localhost:3000/](http://localhost:3000/) (it won't be used to evaluate your solutions)
5. `nvm install` - (optional) set up the expected _major_ version of Node.js locally ([`nvm`](https://github.com/nvm-sh/nvm) required; Node.js version defined in `.nvmrc` file)

This application was generated using [Create React App](https://github.com/facebook/create-react-app). It has all the standard setups.

# Work Notes

* Prepare project so I can have env for jest tests and also some running server so I can test it in the browser as well.
* Before writing test I would like to have interfaces ready, according to the specs the input has to be an object {}. The key in all cases seems to be a string, but the value can be different (string, null, undefined, object). I will give it a name IUpdateObjectInput and use it in `updateObject` function. The return type should be a normal object, except that the array element can have "_id". Also it looks like there is no array nesting according to the specs, but I should ask this question.
* Now that interfaces are ready, it is time to write some tests before implementing anything in the function. I will first cover generic tests, and then after that I will cover test cases given by github gist (specs from Hokify)
* Since the tests are ready, it is time to implement function `updateObject`. Lets see if the AI can help me to implement this. AI generated some code, lets see what I have to fix. Generated code is really messy, I will have to split it into multiple funtions since it is really readable. Also some tests are failing, so I will first try to fix these failing tests. I managed to fix the code, so the tests are passing now. However, the code is really bad and complicated so I will have to refactor it later.




# Specs
Link: https://gist.github.com/simllll/a130e1c81c66ab1a3c3cdb51025f95df#file-hokify-backend-coding-challenge1-md
## hokify backend coding challenge1
#### spec 1.1

- normal objects, are just specified by the key.
- keys are seperated by "." e.g. root.path.subpath is referring to: { root: { path: { subpath: <>} } }
- array entries, can be specified by their root object (e.g. cvInfo.experiences: [..]) or by
  specifing a [ ] at the end. If the value between [ ] is empty, it means adding a new entry,
  if there is value inside [ ], look for the entry with the corresponding \_id.
  (fallback, if \_id is a number, use it as index - not needed right now)
- if a key is specified without a value (null / undefined), remove the entry.
  for arrays: remove this entry, for other objects just unset the value.
- if a path does not exist, create it.. depending on the specified path as object or as array. (see example 8)
- write one function that can handle all cases (and passes the pre defined tests)
- all input and output objects of the functions are JS objects

#### test suite

object before each update:

```js
obj = {
	a: {
		b: [
			{ _id: '5dc0ad700000000000000000', name: 'asdf1' },
			{ _id: '5dc0ad700000000000000001', name: 'asdf2' },
			{ _id: '5dc0ad700000000000000002', name: 'asdf3' }
		]
	},
	value: 'hui'
};
```

##### 1. apply update / change array object:

update:

```json
{
	"a.b[5dc0ad700000000000000000]": { "title": "asdf1-updated" }
}
```

algorithmn should look up the a.b inside of "obj" and look for a value
of \_id of "5dc0ad700000000000000000". in there, it should update the whole object, beware
\_id should still be appended!

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "title": "asdf1-updated" }, // name got removed, all other objects got overwritten, _id is still automatically applid though
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		]
	},
	"value": "hui"
}
```

##### 2. apply update / change array value:

update:

```json
{
	"a.b[5dc0ad700000000000000000].titleValue": "asdf1-updated"
}
```

algorithmn should look up the a.b inside of "obj" and look for a value
of \_id of "5dc0ad700000000000000000". in there, it should set the value of titleValue
to "asdf1-updated".

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1", "titleValue": "asdf1-updated " }, // titleValue got added / overwritten (if it was ther already). all other values remain the same
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		]
	},
	"value": "hui"
}
```

##### 3. add an array entry:

update:

```json
{
	"a.b[]": { "_id": "5dc0ad700000000000000003", "name": "co2" }
} 
```

algorithmn should look up the a.b inside of "obj" and
add a new entry with \_id "5dc0ad700000000000000003" and name set to co2.

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1" },
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" },
			{ "_id": "5dc0ad700000000000000003", "name": "co2" } // this entry has been added
		]
	},
	"value": "hui"
}
```

##### 4. remove array entry:

update:

```json
{
	"a.b[5dc0ad700000000000000001]": null
}
```

algorithmn should look up the array with path "a.b" inside of "obj", in there
it should look for an entry with \_id of "5dc0ad700000000000000001". this entry should be removed if found.

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1" },
			// asdf2- id has been removed
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		]
	},
	"value": "hui"
}
```

##### 5. add regular object value

update:

```json
{
	"a.c": "hallo"
}
```

algorithmn should get the obect a inside of "obj" and set
the property c to "hallo".

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1" },
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		],
		"c": "hallo" // <-- this property has been added
	},
	"value": "hui"
}
```

##### 6. update regular object value

update:

```json
{
	"a.c": "hallo-changed"
}
```

algorithmn should get the obect a inside of "obj" and set
the property c to "hallo".

input:

```js
obj = {
	a: {
		b: [
			{ _id: '5dc0ad700000000000000000', name: 'asdf1' },
			{ _id: '5dc0ad700000000000000001', name: 'asdf2' },
			{ _id: '5dc0ad700000000000000002', name: 'asdf3' }
		],
		c: 'hallo'
	},
	value: 'hui'
};
```

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1" },
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		],
		"c": "hallo-changed" // <-- this property has been updated
	},
	"value": "hui"
}
```

##### 7. unset regular object value on root level

update:

```json
{
	"value": null
}
```

algorithmn should remove "value" of the root object.

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1" },
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		]
	}
	// value is not here anymore
}
```

##### 8. unset regular object value NOT on root level

update:

```json
{
	"a.b": null
}
```

algorithmn should remove "value" of the root object.

output:

```json
{
	"a": {
		// b is not here anymore
	},
	"value": "hui"
}
```

##### 9. multiple operations at one time

update:

```json
{
	"value": null,
	"something": "anything",
	"a.c": "hallo"
}
```

algorithmn should apply all updates.

output:

```json
{
	"a": {
		"c": "hallo", // 3. a.c is set to hallo
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1" },
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		]
	},
	"something": "anything" // 2. something with value anything
	// 1. value has been removed
}
```

##### 10. apply array update and create underyling array or object

update:

```json
{
	"x[]": "asdfX",
	"v.x[]": "asdfV",
	"v.m.l": "asdf-val"
}
```

algorithmn should add x and v.x as new arrays, and adds the value for path v.m.l.

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1" },
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		]
	},
	"x": ["asdfX"], // empty array x has been created, and asdfX has been added.
	"v": {
		// v has been automatically created as object
		"x": ["asdfV"], // underyling x has been created as array
		"m": {
			// m has been created automatically as object
			"l": "asdf-val" // vaue of l has been set to asdf-val
		}
	},
	"value": "hui"
}
```

### 11. apply user image update

input:

```js
obj = {
	a: {
		b: [
			{ _id: '5dc0ad700000000000000000', name: 'asdf1' },
			{ _id: '5dc0ad700000000000000001', name: 'asdf2' },
			{ _id: '5dc0ad700000000000000002', name: 'asdf3' }
		]
	},
	value: 'hui',
	images: {
		thumbnail: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
		small: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
		medium: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
		large: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
		xlarge: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg'
	}
};
```

update:

```json
{
	"images": {
		"thumbnail": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
		"small": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
		"medium": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
		"large": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
		"xlarge": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg"
	}
}
```

output:

```json
{
	"a": {
		"b": [
			{ "_id": "5dc0ad700000000000000000", "name": "asdf1" },
			{ "_id": "5dc0ad700000000000000001", "name": "asdf2" },
			{ "_id": "5dc0ad700000000000000002", "name": "asdf3" }
		]
	},
	"value": "hui",
	"images": {
		"thumbnail": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
		"small": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
		"medium": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
		"large": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
		"xlarge": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg"
	}
}
```