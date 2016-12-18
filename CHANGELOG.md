# Change Log
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.0] - 2016-12-17
### Added window loaded events: `load`, `load.interactive`, and `load.complete`.

## [0.3.0] - 2016-12-17
### Added
- Added `updateState` method, which is useful when an event other than window resize causes the page's scroll position or scroll height to change.

## [0.2.0] - 2016-12-15
### Added
- Added window visibility events: `visibilityChange`, `visibilityChange.hide`, `visibilityChange.show`.
- Added `percentScrolled` and `visible` properties to `getData` return object

### Changed
- Changed callback parameter of scroll events to be an object with `scrollTop` and `percentScrolled` properties
