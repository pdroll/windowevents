# WindowEvents.js
Your one stop shop for listening for all window load, scroll, resize and visibility change events.

Provides a simple and unified interface for adding event listeners for 18 common and useful events including window loaded, scroll start, scroll stop, resize stop, orientation change, window becoming visible and more.

This library handles the throttling of the event listeners when needed, does not require jQuery or any other external library, and is less than 9KB in size.

## Demo
[See it in action](http://codepen.io/pdroll/pen/RoqRzY?editors=0010)

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
<script src="//cdn.jsdelivr.net/windowevents/latest/windowevents.min.js"></script>
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
winEvents.on('scroll.stop', function(scrollData) {
    doSomething(scrollData.scrollPercent)
});
```


### `winEvents.once(eventName, callback)`

Subscribe to an event only once.

```javascript
// Function will only fire for first time you scroll to the bottom of the page
winEvents.once('scroll.bottom', function(scrollData) {
    doSomethingOnce(scrollData.scrollTop)
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
var firstListener = winEvents.on('scroll.down', function(scrollData) {
  console.log('We are scrolling down the page');
});

var secondListener = winEvents.on('scroll.down', function(scrollData) {
  console.log('Another listener for scrolling down');
});

// Unsubscribe just the first Listener
winEvents.off('scroll.down', firstListener);

// The first listener will no longer fire
// when the window is scrolled down, but
// the second listener will continue to work.
```

### `winEvents.getState()`

Immediately get current size, scroll position, and visibility of the window. Returns an object with the following properties:

- `width`
- `height`
- `orientation` ("portrait" or "landscape")
- `scrollHeight`
- `scrollTop`
- `scrollPercent`
- `visible`
- `loaded` ("loading", "interactive", or "complete")

### `winEvents.updateState()`

This method is useful when some event, other than the window being resized, causes the window to page to change scroll height or scroll position. Examples could be more content being loaded or an element being hidden or shown.

Returns an object with the following properties:

- `width`
- `height`
- `orientation` ("portrait" or "landscape")
- `scrollHeight`
- `scrollTop`
- `scrollPercent`
- `visible`
- `loaded` ("loading", "interactive", or "complete")

## Events

The following events are available to subscribe to:

### Scroll Events

All scroll listeners will receive one parameter, an object with the following properties:

- `scrollTop`
- `scrollPercent`

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

All resize listeners will receive one parameter, an object with the following properties:

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

### Visibility Events

These events let you know when a webpage is visible or in focus, and they rely on the [Page Visibility API](https://developer.mozilla.org/docs/Web/API/Page_Visibility_API). Unfortunately, this API [isn't supported in IE 9 or older](http://caniuse.com/#feat=pagevisibility).

All visibility listeners will receive one parameter, an object with the following property:

- `visible` (`true` or `false`)

|       Event Name        |   Description   |
|-------------------------|-----------------|
| `visibilityChange`      | The page visibility has changed. |
| `visibilityChange.show` | The page was previously not visible and just became visible. |
| `visibilityChange.hide` | The page was previously visible and just lost visibility. |

### Load Events

These events will notify you when the DOM has been parsed and when all images and resources have finished loading. They are based on the document `readystatechange` event.

All load listeners will receive one parameter, an object with the following property:

- `loaded` ("interactive" or "complete")

|    Event Name      |   Description   |
|--------------------|-----------------|
| `load`             | There has been any change to `document.readyState`. Will fire twice on every page load. |
| `load.interactive` | The DOM has been parsed and is ready to be interacted with. Equivalent to [jQuery's document ready](https://learn.jquery.com/using-jquery-core/document-ready/) event. |
| `load.complete`    | All images and resources within the page have finished loading. |
