# Change Log
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.0] - 2016-12-15
### Added
- Added window visibility events: `visibilityChange`, `visibilityChange.hide`, `visibilityChange.show`.
- Added `percentScrolled` and `visible` properties to `getData` return object

### Changed
- Changed callback parameter of scroll events to be an object with `scrollTop` and `percentScrolled` properties
