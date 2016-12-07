
 /*!
 * WindowEvents.js
 * @author Pete Droll <droll.p@gmail.com>
 * @license MIT
 */
import publisher from 'covjs';
import debounce from 'throttle-debounce/debounce';
import throttle from 'throttle-debounce/throttle';
import ScrollEvents from './scroll';
import ResizeEvents from './resize';

class WindowEvents {

  constructor(opts) {
    const defaultOptions = {
      scrollDelay: 100,
      resizeDelay: 100,
    };

    this.options = opts ? { ...defaultOptions, ...opts } : defaultOptions;
    this.on = publisher.on;
    this.once = publisher.once;
    this.off = publisher.off;
  }

  listen() {
    const resizeEvents = new ResizeEvents(publisher, this.options);
    // Pass resizeEvents object to scroll listener
    // in order to have access to window height, width
    const scrollEvents = new ScrollEvents(publisher, this.options, resizeEvents);

    window.addEventListener('scroll', debounce(
      // Delay
      this.options.scrollDelay,
      // At beginning
      true,
      // Debounced function
      scrollEvents.debouncedListener,
    ));
    window.addEventListener('scroll', throttle(
      // Delay
      this.options.scrollDelay,
      // No Trailing. If false, will get called one last time after the last throttled call
      false,
      // Throttled function
      scrollEvents.throttledListener,
    ));
    window.addEventListener('resize', debounce(
      // Delay
      this.options.resizeDelay,
      // At beginning
      true,
      // Debounced function
      resizeEvents.debouncedListener,
    ));
    window.addEventListener('resize', throttle(
      // Delay
      this.options.resizeDelay,
      // No Trailing. If false, will get called one last time after the last throttled call
      false,
      // Throttled function
      resizeEvents.throttledListener,
    ));
  }
}

module.exports = WindowEvents;
