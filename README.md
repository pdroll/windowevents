# WindowEvents.js
Easily add event listeners to useful scroll and resize events: scroll start, scroll stop, resize stop, orientation change, and more.

This library handles the throttling of the event listeners for you, does not require jQuery, is under 8KB in size.

## Install
You can install this in a couple ways:

### Install and load as an NPM module

```shell
npm install windowevents --save
```

or if you use [Yarn](https://yarnpkg.com/)

```shell
yarn add windowevents
```

Load the library in your JS file:

```javascript
var WindowEvents = require('windowevents');
```

### OR Install using a `<script>` tag:

Include library script tag before your application JS.

```html
<script src="windowevents.min.js"></script>
```

After that has loaded, a  `WindowEvents` variable will be available on the `window` object.

```javascript
// WindowEvents variable is
// already loaded for you
console.log(WindowEvents);
```

## Usage

First step is initialize the `WindowEvents` object:

```javascript
var winEvents = new WindowEvents();
```

### Options
You can optionally supply an options object to the constructor:

```javascript
var options = {
  scrollDelay: 100,
  resizeDelay: 350
};
var winEvents = new WindowEvents(options);
```
#### Available options
|    Option     | Type | Description |
|---------------|------|-------------|
| `scrollDelay` | int  | Number of milliseconds that the scroll events will be throttled. Default 100 |
| `resizeDelay` | int  | Number of milliseconds that the resize events will be throttled. Default 350 |

## Methods

on, once, off, getState

## Events

### Scroll

### Resize Events




