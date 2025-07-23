# ajv-mongoose-converter - Changelog

_Converts a ajv schema into mongoose schema_

All notable changes to this project will be documented in this file.

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

