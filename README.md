# WindowEvents.js
Easily add event listeners to useful scroll and resize events: scroll start, scroll stop, resize stop, orientation change, and more.

This library handles the throttling of the event listeners for you, does not require jQuery, and is under 8KB in size.

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
<script src="https://unpkg.com/windowevents@0.1.2/windowevents.min.js"></script>
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

### `winEvents.on(eventName, callback)`

Subscribe to a window event.

```javascript
// Subscribe to the 'scroll.stop' event
winEvents.on('scroll.stop', function(scrollTop) {
    doSomething(scrollTop)
});
```


### `winEvents.once(eventName, callback)`

Subscribe to an event only once.

```javascript
// Function will only fire for first time you scroll to the bottom of the page
winEvents.once('scroll.bottom', function(scrollTop) {
    doSomethingOnce(scrollTop)
});
```

### `winEvents.off(eventName)`

Unsubscribe all listeners to an event:

```javascript
// unsubscribe from 'resize.stop'
winEvents.off('resize.stop');
```

### `winEvents.off(eventName, listenerToken)`

Unsubscribe one specific listener to an event.

You'll need to save the token returned by your call to `winEvents.on()`

```javascript
var firstListener = winEvents.on('scroll.down', function(scrollTop) {
  console.log('We are scrolling down the page');
});

var secondListener = winEvents.on('scroll.down', function(scrollTop) {
  console.log('Another listener for scrolling down');
});

// Unsubscribe just the first Listener
winEvents.off('scroll.down', firstListener);

// The first listener will no longer fire
// when the window is scrolled down, but
// the second listener will continue to work.
```

### `winEvents.getState()`

Immediately get current size and scroll position of window. Returns an object with the following properties:

- `width`
- `height`
- `orientation` ("portrait" or "landscape")
- `scrollHeight`
- `scrollTop`

## Events

The following events are available to subscribe to:

### Scroll Events

All scroll listeners will recieve one parameter, the interger of the current window scrollTop.

|   Event Name    | Description |
|-----------------|-------------|
| `scroll.start`  | Scrolling has started. |
| `scroll`        | Will fire while scrolling in either direction. Will be throttled and only fire once in every interval defined in the `scrollDelay` option. |
| `scroll.down`   | Same as `scroll`, but will only fire if scrolling down. |
| `scroll.up`     | Same as `scroll`, but will only fire if scrolling up. |
| `scroll.bottom` | Will fire when scrolling has reached the bottom of the page. |
| `scroll.top`    | Will fire when scrolling has reached the top of the page. |
| `scroll.stop`   | Scrolling has stopped. |

### Resize Events


All resize listeners will recieve one parameter, an object with the following properties:

- `width`
- `height`
- `orientation` ("portrait" or "landscape")
- `scrollHeight`

|         Event Name          |   Description   |
|-----------------------------|-----------------|
| `resize.start`              | The window has started to be resized. |
| `resize`                    | Will fire while the window is being resized. Will be throttled and only fire once in every interval defined in the `resizeDelay` option. |
| `resize.orientationChange`  | Will fire when the window has been resized from portrait to landscape, or vice versa. |
| `resize.scrollHeightChange` | Will fire when resizing has caused the `document.body.scrollHeight` to change.  |
| `resize.stop`               | The window has stopped being resized. |



