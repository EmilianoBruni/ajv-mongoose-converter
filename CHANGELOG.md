# ajv-mongoose-converter - Changelog

_Converts a ajv schema into mongoose schema_

All notable changes to this project will be documented in this file.

## [1.2.5] 2025/11/15

### Added

- Add support for ref, spare, text and transform properties

## [1.2.4] 2025/11/03

### Fixed

- correct regex pattern matching for ObjectId detection

### Added

- enhance mooSchemaElement with additional properties for validation
- add support for nullable property in schema conversion
- add support for convert index and unique props

## [1.2.3] 2025/10/07

### Fixed

- Add support for Mongoose "default"

## [1.2.2] 2025/07/24

### Added

- Add support for 'only_object' and 'buffer' for object with buffer property

## [1.2.1] 2025/07/23

### Fixed

- According to OpenAPI3.0 specs, format binary has type string. Add format byte too.

## [1.2.0] 2025/07/23

### Added

- Support for type:'object' format: 'binary' converted into Buffer SchemaType

### Fixed

- Minor bugs

## [1.1.1] 2024/02/08

### Fixed

- Fix exports path in package.json

## [1.1.0] 2024/02/01

### Added

- Converted to Typescript
- Converted to ES module
- Add support for commonJS

## [1.0.0] 2023/06/04

### Added

- First public release

[1.2.5]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.2.5
[1.2.4]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.2.4
[1.2.3]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.2.3
[1.2.2]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.2.2
[1.2.1]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.2.1
[1.2.0]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.2.0
[1.1.1]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.1.1
[1.1.0]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.1.0
[1.0.0]: https://github.com/EmilianoBruni/ajv-mongoose-converter/releases/tag/v1.0.0
