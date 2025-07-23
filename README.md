# Convert ajv into mongoose schema

This module converts a ajv schema into mongoose schema

Usage: 

```javascript

const ajv2mongoose = require('ajv-mongoose-converter');
const ajv_schema = {...};
const mongoose_schema = ajv2mongoose(ajv_schema);

```

As this object will be converted

```javascript

const ajv_schema = {
    properties: {
        "_id": { type: "string", pattern: '^[0-9a-fA-F]{24}$' },
        "name": { type: "string", example: "Emiliano" },
        "age": { type: "integer", example: 55 },
        "weight": { type: "number", example: 65.5 },
        "accepted": { type: 'boolean', example: true },
        "car": {
            properties: {
                "id": { type: "integer", example: 1 },
                "model": { type: "string", example: "Ford" },
            }
        },
        "birthday": { type: "string", format: 'date' },
        "ts": { type: "timestamp" },
        "pets": { type: 'array', items: { type: "string" } },
        "custom_type": { type: 'custom_type' },
        "file_content": { type: 'object', format: 'binary' }
    },
    required: ["name", "car.id"],
};

```

into

```javascript
{
  _id: { type: 'ObjectId' },
  name: { type: 'String', required: true },
  age: { type: 'Number' },
  weight: { type: 'Number' },
  accepted: { type: 'Boolean' },
  car: { id: { type: 'Number', required: true }, model: { type: 'String' } },
  birthday: { type: 'Date' },
  ts: { type: 'Date' },
  pets: { type: [ 'String' ] },
  custom_type: { type: 'Mixed' },
  file_content: {type: 'Buffer' }
}

```
## Installation

```bash
npm i ajv-mongoose-converter -s
```

## Usage with [fastify-mongoose-api](https://github.com/jeka-kiselyov/fastify-mongoose-api)

In [fastify-mongoose-api](https://github.com/jeka-kiselyov/fastify-mongoose-api) you could have an object which describes Mongoose schema and validation schema.

Without ajv-mongoose-converter your should write something like this

```javascript

const personSchema = {
    name: 'person',
    ref: [{
        $id: 'person',
        properties: {
            "_id": { type: "string", pattern: '^[0-9a-fA-F]{24}$' },
            "name": { type: "string", example: "Emiliano" },
            "age": { type: "integer", example: 55 },
            "weight": { type: "number", example: 65.5 },
            "accepted": { type: 'boolean', example: true },
            "car": {
                properties: {
                    "id": { type: "integer", example: 1 },
                    "model": { type: "string", example: "Ford" },
                }
            },
            "birthday": { type: "string", format: 'date' },
            "ts": { type: "timestamp" },
            "pets": { type: 'array', items: { type: "string" } },
            "custom_type": { type: 'custom_type' }
        },
        required: ["name", "car.id"],
    }],
    schema: {
        _id: { type: 'ObjectId' },
        name: { type: 'String', required: true },
        age: { type: 'Number' },
        weight: { type: 'Number' },
        accepted: { type: 'Boolean' },
        car: { id: { type: 'Number', required: true }, model: { type: 'String' } },
        birthday: { type: 'Date' },
        ts: { type: 'Date' },
        pets: { type: [ 'String' ] },
        custom_type: { type: 'Mixed' }
    },
    routeGet: { ... },
	routePost: { ... },
	routeList: { ... },
	routePut: { ... },
	routePatch: { ... },
	routeDelete: { ... },
}

```

with duplicated infos in `schema` and `ref`.

With ajv-mongoose-converter this can be rewrite intro

```javascript

const conv = require('ajv-mongoose-converter');

const personSchema = {
    name: 'person',
    ref: [{
        $id: 'person',
        properties: {
            "_id": { type: "string", pattern: '^[0-9a-fA-F]{24}$' },
            "name": { type: "string", example: "Emiliano" },
            "age": { type: "integer", example: 55 },
            "weight": { type: "number", example: 65.5 },
            "accepted": { type: 'boolean', example: true },
            "car": {
                properties: {
                    "id": { type: "integer", example: 1 },
                    "model": { type: "string", example: "Ford" },
                }
            },
            "birthday": { type: "string", format: 'date' },
            "ts": { type: "timestamp" },
            "pets": { type: 'array', items: { type: "string" } },
            "custom_type": { type: 'custom_type' }
        },
        required: ["name", "car.id"],
    }],
    get schema() {
        return conv(this.ref[0]);
    },
    ...
}


```

## CommonJS

This module supports both ESM and CommonJS. If you are using CommonJS, you can import it like so:

```js
const conv = require('avj-mongoose-converter');
```

## Bugs / Help / Feature Requests / Contributing

* For feature requests or help, please visit [the discussions page on GitHub](https://github.com/EmilianoBruni/avj-mongoose-converter/discussions).

* For bug reports, please file an issue on [the issues page on GitHub](https://github.com/EmilianoBruni/avj-mongoose-converter/issues).

* Contributions welcome! Please open a [pull request on GitHub](https://github.com/EmilianoBruni/avj-mongoose-converter/pulls) with your changes. You can run them by me first on [the discussions page](https://github.com/EmilianoBruni/avj-mongoose-converter/discussions) if you'd like. Please add tests for any changes.


## Tests

Clone fastify-mongoose-api, run `npm install` in its directory and run `npm test` to run [unit tests](./test).

## License

Licensed under [GPLv3](./LICENSE)