# Change Log
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0] - 2016-12-17
This completes the list of events that are initially planned to be added.

### Added
- Added window load events: `load`, `load.interactive`, and `load.complete`.

### Changed
- State is updated when any load event occurs. This will correctly handle images loading and changing the scrollHeight of a page.

## [0.3.0] - 2016-12-17
### Added
- Added `updateState` method, which is useful when an event other than window resize causes the page's scroll position or scroll height to change.

## [0.2.0] - 2016-12-15
### Added
- Added window visibility events: `visibilityChange`, `visibilityChange.hide`, `visibilityChange.show`.
- Added `percentScrolled` and `visible` properties to `getData` return object

### Changed
- Changed callback parameter of scroll events to be an object with `scrollTop` and `percentScrolled` properties
