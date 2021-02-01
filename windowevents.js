(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WindowEvents = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * @author Dave Devor <davedevor@gmail.com>
   */

  /**
   * Checks if a variable is a function
   * @param  {Function} fn
   *
   * @returns {Boolean}
   */
  function _isFn(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
  }
  /**
   * Store incrementing ID for each passed callback
   * @type  {Int}
   */


  var callbackId = 0;
  /**
   * Store all of our covenants
   * @type  {Array}
   */

  var covenants = [];
  /**
   * One object to hold all of the apps covenants.
   * @type {Object}
   */

  var Cov = {
    /**
     * Register an event, or add to an existing event
     * @param   {String}  name    Name of the event like: 'loaded'
     * @param   {Function}  fn    The closure to execute when signaled.
     * @return  {Mixed}           Unique ID for listener or false on incorrect parameters
     */
    on: function on() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var fn = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1]; // Make sure the fn is a function

      var isFn = _isFn(fn);

      if (name && fn && isFn) {
        var _exists = false;
        var cbObj = {
          id: 'cov_' + ++callbackId,
          fn: fn
        }; // check if this even exists

        covenants.forEach(function (cov) {
          // If it already exists, add the function to its functions.
          if (cov.name === name) {
            cov.callbacks.push(cbObj);
            _exists = true;
            return;
          }
        }); // If it doesnt exist create it.

        if (!_exists) {
          var newCovenant = {
            name: name,
            callbacks: [cbObj]
          };
          covenants.push(newCovenant);
        }

        return cbObj.id;
      }

      return false;
    },

    /**
     * Register an event to fire only once
     * @param   {String}  name    Name of the event like: 'loaded'
     * @param   {Function}  fn    The closure to execute when signaled.
     * @return  {Mixed}           Unique ID for listener or false on incorrect parameters
     */
    once: function once() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var fn = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var newId = 'cov_' + (callbackId + 1);

      var oneTimeFunc = function () {
        fn.apply(null, arguments);
        this.off(name, newId);
      }.bind(this);

      this.on(name, oneTimeFunc);
      return newId;
    },

    /**
     * Signal an event and run all of its subscribed functions.
     * @param  {String}    name  Name of the event like: 'loaded';
     * @param  {object[]}  args  Any arguments that need to be sent to the  fn
     * @return {object}          Current instance of Cov, to allow for chaining
     */
    signal: function signal() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      if (name) {
        covenants.forEach(function (cov) {
          if (cov.name === name) {
            cov.callbacks.forEach(function (cbObj) {
              cbObj.fn.apply(null, args);
            });
            return;
          }
        });
      }

      return this;
    },

    /**
     * Unregister (turn off) an event.
     * @param  {String}  Name of the event like: 'loaded';
     * @param  {String}  ID of listener as returned by `on` function
     * @return {object}  Current instance of Cov, to allow for chaining
     */
    off: function off() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var id = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (name) {
        covenants.forEach(function (cov, index, arr) {
          if (cov.name === name) {
            // If no ID is passed, remove all listeners
            if (!id) {
              arr.splice(index, 1);
            } else {
              // Otherwise just remove specified callback
              cov.callbacks.forEach(function (cbObj, ix, callbacks) {
                if (cbObj.id === id) {
                  callbacks.splice(ix, 1);
                }
              });
            }

            return;
          }
        });
      }

      return this;
    }
  };
  var cov = Cov;

  /* eslint-disable no-undefined,no-param-reassign,no-shadow */

  /**
   * Throttle execution of a function. Especially useful for rate limiting
   * execution of handlers on events like resize and scroll.
   *
   * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param  {Boolean}   [noTrailing]   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
   *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
   *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
   *                                    the internal counter is reset)
   * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
   *                                    to `callback` when the throttled-function is executed.
   * @param  {Boolean}   [debounceMode] If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
   *                                    schedule `callback` to execute after `delay` ms.
   *
   * @return {Function}  A new, throttled, function.
   */
  var throttle = function throttle(delay, noTrailing, callback, debounceMode) {
    // After wrapper has stopped being called, this timeout ensures that
    // `callback` is executed at the proper times in `throttle` and `end`
    // debounce modes.
    var timeoutID; // Keep track of the last time `callback` was executed.

    var lastExec = 0; // `noTrailing` defaults to falsy.

    if (typeof noTrailing !== 'boolean') {
      debounceMode = callback;
      callback = noTrailing;
      noTrailing = undefined;
    } // The `wrapper` function encapsulates all of the throttling / debouncing
    // functionality and when executed will limit the rate at which `callback`
    // is executed.


    function wrapper() {
      var self = this;
      var elapsed = Number(new Date()) - lastExec;
      var args = arguments; // Execute `callback` and update the `lastExec` timestamp.

      function exec() {
        lastExec = Number(new Date());
        callback.apply(self, args);
      } // If `debounceMode` is true (at begin) this is used to clear the flag
      // to allow future `callback` executions.


      function clear() {
        timeoutID = undefined;
      }

      if (debounceMode && !timeoutID) {
        // Since `wrapper` is being called for the first time and
        // `debounceMode` is true (at begin), execute `callback`.
        exec();
      } // Clear any existing timeout.


      if (timeoutID) {
        clearTimeout(timeoutID);
      }

      if (debounceMode === undefined && elapsed > delay) {
        // In throttle mode, if `delay` time has been exceeded, execute
        // `callback`.
        exec();
      } else if (noTrailing !== true) {
        // In trailing throttle mode, since `delay` time has not been
        // exceeded, schedule `callback` to execute `delay` ms after most
        // recent execution.
        //
        // If `debounceMode` is true (at begin), schedule `clear` to execute
        // after `delay` ms.
        //
        // If `debounceMode` is false (at end), schedule `callback` to
        // execute after `delay` ms.
        timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
      }
    } // Return the wrapper function.


    return wrapper;
  };

  /* eslint-disable no-undefined */
  /**
   * Debounce execution of a function. Debouncing, unlike throttling,
   * guarantees that a function is only executed a single time, either at the
   * very beginning of a series of calls, or at the very end.
   *
   * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param  {Boolean}  [atBegin]     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
   *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
   *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
   * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
   *                                  to `callback` when the debounced-function is executed.
   *
   * @return {Function} A new, debounced function.
   */

  var debounce = function debounce(delay, atBegin, callback) {
    return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
  };

  var ScrollEvents = /*#__PURE__*/function () {
    function ScrollEvents(publisher, options, sizeRef) {
      _classCallCheck(this, ScrollEvents);

      this.signal = publisher.signal;
      this.options = options;
      this.windowSize = sizeRef;
      this.scrollTimeout = null;
      this.debouncedListener = this.debouncedListener.bind(this);
      this.throttledListener = this.throttledListener.bind(this);
      this.updateState();
    }

    _createClass(ScrollEvents, [{
      key: "updateState",
      value: function updateState() {
        this.scrollTop = this.lastScrollTop = window.scrollY || window.pageYOffset;
        this.scrollPercent = this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height) * 100;
      }
    }, {
      key: "getState",
      value: function getState() {
        return {
          scrollTop: this.scrollTop,
          scrollPercent: this.scrollPercent
        };
      }
    }, {
      key: "debouncedListener",
      value: function debouncedListener() {
        this.scrollTop = window.scrollY || window.pageYOffset;
        this.scrollPercent = this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height) * 100;
        this.signal('scroll.start', [{
          scrollTop: this.scrollTop,
          scrollPercent: this.scrollPercent
        }]);
        this.lastScrollTop = this.scrollTop;
      }
    }, {
      key: "throttledListener",
      value: function throttledListener() {
        var _this = this;

        this.scrollTop = window.scrollY || window.pageYOffset;
        this.scrollPercent = this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height) * 100;
        var scrollObj = {
          scrollTop: this.scrollTop,
          scrollPercent: this.scrollPercent
        };
        this.signal('scroll', [scrollObj]);

        if (this.scrollTop > this.lastScrollTop) {
          this.signal('scroll.down', [scrollObj]);
        } else if (this.scrollTop < this.lastScrollTop) {
          this.signal('scroll.up', [scrollObj]);
        }

        if (this.scrollTop <= 0) {
          this.signal('scroll.top', [scrollObj]);
        }

        if (scrollObj.scrollPercent >= 100) {
          this.signal('scroll.bottom', [scrollObj]);
        }

        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(function () {
          _this.signal('scroll.stop', [scrollObj]);
        }, this.options.scrollDelay + 1);
        this.lastScrollTop = this.scrollTop;
      }
    }]);

    return ScrollEvents;
  }();

  var ResizeEvents = /*#__PURE__*/function () {
    function ResizeEvents(publisher, options) {
      _classCallCheck(this, ResizeEvents);

      this.signal = publisher.signal;
      this.options = options;
      this.resizeTimeout = null;
      this.debouncedListener = this.debouncedListener.bind(this);
      this.throttledListener = this.throttledListener.bind(this);
      this.updateState();
    }

    _createClass(ResizeEvents, [{
      key: "updateState",
      value: function updateState() {
        this.height = this.lastH = window.innerHeight;
        this.width = this.lastW = window.innerWidth;
        this.scrollHeight = this.lastS = document.body.scrollHeight;
        this.orientation = this.lastO = this.height > this.width ? 'portrait' : 'landscape';
      }
    }, {
      key: "getState",
      value: function getState() {
        return {
          height: this.height,
          width: this.width,
          scrollHeight: this.scrollHeight,
          orientation: this.orientation
        };
      }
    }, {
      key: "debouncedListener",
      value: function debouncedListener() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.scrollHeight = document.body.scrollHeight;
        this.orientation = this.height > this.width ? 'portrait' : 'landscape';
        var sizeObj = {
          height: this.height,
          width: this.width,
          scrollHeight: this.scrollHeight,
          orientation: this.orientation
        };
        this.signal('resize.start', [sizeObj]);
        this.lastH = this.height;
        this.lastW = this.width;
        this.lastS = this.scrollHeight;
      }
    }, {
      key: "throttledListener",
      value: function throttledListener() {
        var _this = this;

        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.scrollHeight = document.body.scrollHeight;
        this.orientation = this.height > this.width ? 'portrait' : 'landscape';
        var sizeObj = {
          height: this.height,
          width: this.width,
          scrollHeight: this.scrollHeight,
          orientation: this.orientation
        };
        this.signal('resize', [sizeObj]);

        if (this.orientation !== this.lastO) {
          this.signal('resize.orientationChange', [sizeObj]);
        }

        if (this.scrollHeight !== this.lastS) {
          this.signal('resize.scrollHeightChange', [sizeObj]);
        }

        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(function () {
          _this.signal('resize.stop', [sizeObj]);
        }, this.options.resizeDelay + 1);
        this.lastH = this.height;
        this.lastW = this.width;
        this.lastS = this.scrollHeight;
        this.lastO = this.orientation;
      }
    }]);

    return ResizeEvents;
  }();

  var VisibilityEvents = /*#__PURE__*/function () {
    function VisibilityEvents(publisher, options) {
      _classCallCheck(this, VisibilityEvents);

      this.signal = publisher.signal;
      this.options = options;
      this.changeListenter = this.changeListenter.bind(this);
      this.updateState();
    }

    _createClass(VisibilityEvents, [{
      key: "updateState",
      value: function updateState() {
        this.visible = !document.hidden;
      }
    }, {
      key: "getState",
      value: function getState() {
        return {
          visible: this.visible
        };
      }
    }, {
      key: "changeListenter",
      value: function changeListenter() {
        this.visible = !document.hidden;
        var visibleObj = {
          visible: this.visible
        };
        this.signal('visibilityChange', [visibleObj]);

        if (this.visible) {
          this.signal('visibilityChange.show', [visibleObj]);
        } else {
          this.signal('visibilityChange.hide', [visibleObj]);
        }
      }
    }]);

    return VisibilityEvents;
  }();

  var LoadEvents = /*#__PURE__*/function () {
    function LoadEvents(publisher, options) {
      _classCallCheck(this, LoadEvents);

      this.signal = publisher.signal;
      this.options = options;
      this.changeListenter = this.changeListenter.bind(this);
      this.updateState();
    }

    _createClass(LoadEvents, [{
      key: "updateState",
      value: function updateState() {
        this.loaded = document.readyState;
      }
    }, {
      key: "getState",
      value: function getState() {
        return {
          loaded: this.loaded
        };
      }
    }, {
      key: "changeListenter",
      value: function changeListenter() {
        this.loaded = document.readyState;
        var loadedObj = {
          loaded: this.loaded
        };
        this.signal('load', [loadedObj]);

        if (this.loaded === 'interactive') {
          this.signal('load.interactive', [loadedObj]);
        } else if (this.loaded === 'complete') {
          this.signal('load.complete', [loadedObj]);
        }
      }
    }]);

    return LoadEvents;
  }();

  var WindowEvents = function WindowEvents(opts) {
    var _this = this;

    _classCallCheck(this, WindowEvents);

    var defaultOptions = {
      scrollDelay: 100,
      resizeDelay: 350
    };
    this.options = opts ? _objectSpread2(_objectSpread2({}, defaultOptions), opts) : defaultOptions;
    this.on = cov.on;
    this.once = cov.once;
    this.off = cov.off;
    var resizeEvents = new ResizeEvents(cov, this.options); // Pass resizeEvents object to scroll listener
    // in order to have access to window height, width

    var scrollEvents = new ScrollEvents(cov, this.options, resizeEvents);
    var visibilityEvents = new VisibilityEvents(cov, this.options);
    var loadEvents = new LoadEvents(cov, this.options);

    this.getState = function () {
      return _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, resizeEvents.getState()), scrollEvents.getState()), visibilityEvents.getState()), loadEvents.getState());
    };

    this.updateState = function () {
      resizeEvents.updateState();
      scrollEvents.updateState();
      visibilityEvents.updateState();
      loadEvents.updateState();
      return _this.getState();
    };

    window.addEventListener('scroll', debounce( // Delay
    this.options.scrollDelay, // At beginning
    true, // Debounced function
    scrollEvents.debouncedListener), false);
    window.addEventListener('scroll', throttle( // Delay
    this.options.scrollDelay, // No Trailing. If false, will get called one last time after the last throttled call
    false, // Throttled function
    scrollEvents.throttledListener), false);
    window.addEventListener('resize', debounce( // Delay
    this.options.resizeDelay, // At beginning
    true, // Debounced function
    resizeEvents.debouncedListener), false);
    window.addEventListener('resize', throttle( // Delay
    this.options.resizeDelay, // No Trailing. If false, will get called one last time after the last throttled call
    false, // Throttled function
    resizeEvents.throttledListener), false);
    window.addEventListener('visibilitychange', visibilityEvents.changeListenter, false);
    document.addEventListener('readystatechange', function () {
      // Update the state once all
      // images and resources have loaded
      _this.updateState();

      loadEvents.changeListenter();
    }, false);
  };

  return WindowEvents;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93ZXZlbnRzLmpzIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvY292anMvY292LmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL3Rocm90dGxlLmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL2RlYm91bmNlLmpzIiwic3JjL3Njcm9sbC5qcyIsInNyYy9yZXNpemUuanMiLCJzcmMvdmlzaWJpbGl0eS5qcyIsInNyYy9sb2FkLmpzIiwic3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBEYXZlIERldm9yIDxkYXZlZGV2b3JAZ21haWwuY29tPlxuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgdmFyaWFibGUgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKlxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIF9pc0ZuKGZuKSB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIFN0b3JlIGluY3JlbWVudGluZyBJRCBmb3IgZWFjaCBwYXNzZWQgY2FsbGJhY2tcbiAqIEB0eXBlICB7SW50fVxuICovXG52YXIgY2FsbGJhY2tJZCA9IDA7XG5cbi8qKlxuICogU3RvcmUgYWxsIG9mIG91ciBjb3ZlbmFudHNcbiAqIEB0eXBlICB7QXJyYXl9XG4gKi9cbnZhciBjb3ZlbmFudHMgPSBbXTtcblxuLyoqXG4gKiBPbmUgb2JqZWN0IHRvIGhvbGQgYWxsIG9mIHRoZSBhcHBzIGNvdmVuYW50cy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBDb3YgPSB7XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGFuIGV2ZW50LCBvciBhZGQgdG8gYW4gZXhpc3RpbmcgZXZlbnRcblx0ICogQHBhcmFtICAge1N0cmluZ30gIG5hbWUgICAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCdcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgVGhlIGNsb3N1cmUgdG8gZXhlY3V0ZSB3aGVuIHNpZ25hbGVkLlxuXHQgKiBAcmV0dXJuICB7TWl4ZWR9ICAgICAgICAgICBVbmlxdWUgSUQgZm9yIGxpc3RlbmVyIG9yIGZhbHNlIG9uIGluY29ycmVjdCBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRvbjogZnVuY3Rpb24gb24oKSB7XG5cdFx0dmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1swXTtcblx0XHR2YXIgZm4gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgZm4gaXMgYSBmdW5jdGlvblxuXHRcdHZhciBpc0ZuID0gX2lzRm4oZm4pO1xuXG5cdFx0aWYgKG5hbWUgJiYgZm4gJiYgaXNGbikge1xuXHRcdFx0dmFyIF9leGlzdHMgPSBmYWxzZTtcblx0XHRcdHZhciBjYk9iaiA9IHtcblx0XHRcdFx0aWQ6ICdjb3ZfJyArICgrK2NhbGxiYWNrSWQpLFxuXHRcdFx0XHRmbjogZm5cblx0XHRcdH1cblxuXHRcdFx0Ly8gY2hlY2sgaWYgdGhpcyBldmVuIGV4aXN0c1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdikge1xuXHRcdFx0XHQvLyBJZiBpdCBhbHJlYWR5IGV4aXN0cywgYWRkIHRoZSBmdW5jdGlvbiB0byBpdHMgZnVuY3Rpb25zLlxuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLnB1c2goY2JPYmopO1xuXHRcdFx0XHRcdF9leGlzdHMgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIElmIGl0IGRvZXNudCBleGlzdCBjcmVhdGUgaXQuXG5cdFx0XHRpZiAoIV9leGlzdHMpIHtcblx0XHRcdFx0dmFyIG5ld0NvdmVuYW50ID0ge1xuXHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0Y2FsbGJhY2tzOiBbY2JPYmpdXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Y292ZW5hbnRzLnB1c2gobmV3Q292ZW5hbnQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNiT2JqLmlkO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgYW4gZXZlbnQgdG8gZmlyZSBvbmx5IG9uY2Vcblx0ICogQHBhcmFtICAge1N0cmluZ30gIG5hbWUgICAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCdcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgVGhlIGNsb3N1cmUgdG8gZXhlY3V0ZSB3aGVuIHNpZ25hbGVkLlxuXHQgKiBAcmV0dXJuICB7TWl4ZWR9ICAgICAgICAgICBVbmlxdWUgSUQgZm9yIGxpc3RlbmVyIG9yIGZhbHNlIG9uIGluY29ycmVjdCBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRvbmNlOiBmdW5jdGlvbiBvbmNlKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGZuID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHR2YXIgbmV3SWQgPSAnY292XycgKyAoY2FsbGJhY2tJZCArIDEpO1xuXHRcdHZhciBvbmVUaW1lRnVuYyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0XHRcdHRoaXMub2ZmKG5hbWUsIG5ld0lkKTtcblx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLm9uKG5hbWUsIG9uZVRpbWVGdW5jKTtcblxuXHRcdHJldHVybiBuZXdJZDtcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBTaWduYWwgYW4gZXZlbnQgYW5kIHJ1biBhbGwgb2YgaXRzIHN1YnNjcmliZWQgZnVuY3Rpb25zLlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICAgIG5hbWUgIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnO1xuXHQgKiBAcGFyYW0gIHtvYmplY3RbXX0gIGFyZ3MgIEFueSBhcmd1bWVudHMgdGhhdCBuZWVkIHRvIGJlIHNlbnQgdG8gdGhlICBmblxuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgIEN1cnJlbnQgaW5zdGFuY2Ugb2YgQ292LCB0byBhbGxvdyBmb3IgY2hhaW5pbmdcblx0ICovXG5cdHNpZ25hbDogZnVuY3Rpb24gc2lnbmFsKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1sxXTtcblxuXG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YpIHtcblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNiT2JqKSB7XG5cdFx0XHRcdFx0XHRjYk9iai5mbi5hcHBseShudWxsLCBhcmdzKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblxuXHQvKipcblx0ICogVW5yZWdpc3RlciAodHVybiBvZmYpIGFuIGV2ZW50LlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJztcblx0ICogQHBhcmFtICB7U3RyaW5nfSAgSUQgb2YgbGlzdGVuZXIgYXMgcmV0dXJuZWQgYnkgYG9uYCBmdW5jdGlvblxuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICBDdXJyZW50IGluc3RhbmNlIG9mIENvdiwgdG8gYWxsb3cgZm9yIGNoYWluaW5nXG5cdCAqL1xuXHRvZmY6IGZ1bmN0aW9uIG9mZigpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBpZCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YsIGluZGV4LCBhcnIpIHtcblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0Ly8gSWYgbm8gSUQgaXMgcGFzc2VkLCByZW1vdmUgYWxsIGxpc3RlbmVyc1xuXHRcdFx0XHRcdGlmICghaWQpIHtcblx0XHRcdFx0XHRcdGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGp1c3QgcmVtb3ZlIHNwZWNpZmllZCBjYWxsYmFja1xuXHRcdFx0XHRcdFx0Y292LmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNiT2JqLCBpeCwgY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjYk9iai5pZCA9PT0gaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFja3Muc3BsaWNlKGl4LCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ292O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWZpbmVkLG5vLXBhcmFtLXJlYXNzaWduLG5vLXNoYWRvdyAqL1xuXG4vKipcbiAqIFRocm90dGxlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgcmF0ZSBsaW1pdGluZ1xuICogZXhlY3V0aW9uIG9mIGhhbmRsZXJzIG9uIGV2ZW50cyBsaWtlIHJlc2l6ZSBhbmQgc2Nyb2xsLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gICAgZGVsYXkgICAgICAgICAgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnQgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgIFtub1RyYWlsaW5nXSAgIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgbm9UcmFpbGluZyBpcyB0cnVlLCBjYWxsYmFjayB3aWxsIG9ubHkgZXhlY3V0ZSBldmVyeSBgZGVsYXlgIG1pbGxpc2Vjb25kcyB3aGlsZSB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZC4gSWYgbm9UcmFpbGluZyBpcyBmYWxzZSBvciB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmUgZmluYWwgdGltZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlciB0aGUgbGFzdCB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICogQHBhcmFtICB7RnVuY3Rpb259ICBjYWxsYmFjayAgICAgICBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy4gVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGBjYWxsYmFja2Agd2hlbiB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gICBbZGVib3VuY2VNb2RlXSBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLiBJZiBgZGVib3VuY2VNb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259ICBBIG5ldywgdGhyb3R0bGVkLCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIGRlbGF5LCBub1RyYWlsaW5nLCBjYWxsYmFjaywgZGVib3VuY2VNb2RlICkge1xuXG5cdC8vIEFmdGVyIHdyYXBwZXIgaGFzIHN0b3BwZWQgYmVpbmcgY2FsbGVkLCB0aGlzIHRpbWVvdXQgZW5zdXJlcyB0aGF0XG5cdC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxuXHQvLyBkZWJvdW5jZSBtb2Rlcy5cblx0dmFyIHRpbWVvdXRJRDtcblxuXHQvLyBLZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHRpbWUgYGNhbGxiYWNrYCB3YXMgZXhlY3V0ZWQuXG5cdHZhciBsYXN0RXhlYyA9IDA7XG5cblx0Ly8gYG5vVHJhaWxpbmdgIGRlZmF1bHRzIHRvIGZhbHN5LlxuXHRpZiAoIHR5cGVvZiBub1RyYWlsaW5nICE9PSAnYm9vbGVhbicgKSB7XG5cdFx0ZGVib3VuY2VNb2RlID0gY2FsbGJhY2s7XG5cdFx0Y2FsbGJhY2sgPSBub1RyYWlsaW5nO1xuXHRcdG5vVHJhaWxpbmcgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyBUaGUgYHdyYXBwZXJgIGZ1bmN0aW9uIGVuY2Fwc3VsYXRlcyBhbGwgb2YgdGhlIHRocm90dGxpbmcgLyBkZWJvdW5jaW5nXG5cdC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXG5cdC8vIGlzIGV4ZWN1dGVkLlxuXHRmdW5jdGlvbiB3cmFwcGVyICgpIHtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgZWxhcHNlZCA9IE51bWJlcihuZXcgRGF0ZSgpKSAtIGxhc3RFeGVjO1xuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG5cdFx0Ly8gRXhlY3V0ZSBgY2FsbGJhY2tgIGFuZCB1cGRhdGUgdGhlIGBsYXN0RXhlY2AgdGltZXN0YW1wLlxuXHRcdGZ1bmN0aW9uIGV4ZWMgKCkge1xuXHRcdFx0bGFzdEV4ZWMgPSBOdW1iZXIobmV3IERhdGUoKSk7XG5cdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbikgdGhpcyBpcyB1c2VkIHRvIGNsZWFyIHRoZSBmbGFnXG5cdFx0Ly8gdG8gYWxsb3cgZnV0dXJlIGBjYWxsYmFja2AgZXhlY3V0aW9ucy5cblx0XHRmdW5jdGlvbiBjbGVhciAoKSB7XG5cdFx0XHR0aW1lb3V0SUQgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBkZWJvdW5jZU1vZGUgJiYgIXRpbWVvdXRJRCApIHtcblx0XHRcdC8vIFNpbmNlIGB3cmFwcGVyYCBpcyBiZWluZyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGFuZFxuXHRcdFx0Ly8gYGRlYm91bmNlTW9kZWAgaXMgdHJ1ZSAoYXQgYmVnaW4pLCBleGVjdXRlIGBjYWxsYmFja2AuXG5cdFx0XHRleGVjKCk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuXG5cdFx0aWYgKCB0aW1lb3V0SUQgKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dElEKTtcblx0XHR9XG5cblx0XHRpZiAoIGRlYm91bmNlTW9kZSA9PT0gdW5kZWZpbmVkICYmIGVsYXBzZWQgPiBkZWxheSApIHtcblx0XHRcdC8vIEluIHRocm90dGxlIG1vZGUsIGlmIGBkZWxheWAgdGltZSBoYXMgYmVlbiBleGNlZWRlZCwgZXhlY3V0ZVxuXHRcdFx0Ly8gYGNhbGxiYWNrYC5cblx0XHRcdGV4ZWMoKTtcblxuXHRcdH0gZWxzZSBpZiAoIG5vVHJhaWxpbmcgIT09IHRydWUgKSB7XG5cdFx0XHQvLyBJbiB0cmFpbGluZyB0aHJvdHRsZSBtb2RlLCBzaW5jZSBgZGVsYXlgIHRpbWUgaGFzIG5vdCBiZWVuXG5cdFx0XHQvLyBleGNlZWRlZCwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGBkZWxheWAgbXMgYWZ0ZXIgbW9zdFxuXHRcdFx0Ly8gcmVjZW50IGV4ZWN1dGlvbi5cblx0XHRcdC8vXG5cdFx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZVxuXHRcdFx0Ly8gYWZ0ZXIgYGRlbGF5YCBtcy5cblx0XHRcdC8vXG5cdFx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0b1xuXHRcdFx0Ly8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLlxuXHRcdFx0dGltZW91dElEID0gc2V0VGltZW91dChkZWJvdW5jZU1vZGUgPyBjbGVhciA6IGV4ZWMsIGRlYm91bmNlTW9kZSA9PT0gdW5kZWZpbmVkID8gZGVsYXkgLSBlbGFwc2VkIDogZGVsYXkpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuXHRyZXR1cm4gd3JhcHBlcjtcblxufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmaW5lZCAqL1xuXG52YXIgdGhyb3R0bGUgPSByZXF1aXJlKCcuL3Rocm90dGxlJyk7XG5cbi8qKlxuICogRGVib3VuY2UgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIERlYm91bmNpbmcsIHVubGlrZSB0aHJvdHRsaW5nLFxuICogZ3VhcmFudGVlcyB0aGF0IGEgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBhIHNpbmdsZSB0aW1lLCBlaXRoZXIgYXQgdGhlXG4gKiB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNlcmllcyBvZiBjYWxscywgb3IgYXQgdGhlIHZlcnkgZW5kLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gICBkZWxheSAgICAgICAgIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50IGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gIFthdEJlZ2luXSAgICAgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBhdEJlZ2luIGlzIGZhbHNlIG9yIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYGRlbGF5YCBtaWxsaXNlY29uZHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyIHRoZSBsYXN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiBJZiBhdEJlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25seSBhdCB0aGUgZmlyc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpLlxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrICAgICAgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBkZWxheSwgYXRCZWdpbiwgY2FsbGJhY2sgKSB7XG5cdHJldHVybiBjYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gdGhyb3R0bGUoZGVsYXksIGF0QmVnaW4sIGZhbHNlKSA6IHRocm90dGxlKGRlbGF5LCBjYWxsYmFjaywgYXRCZWdpbiAhPT0gZmFsc2UpO1xufTtcbiIsImNsYXNzIFNjcm9sbEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMsIHNpemVSZWYpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2l6ZVJlZlxuICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IG51bGxcblxuICAgIHRoaXMuZGVib3VuY2VkTGlzdGVuZXIgPSB0aGlzLmRlYm91bmNlZExpc3RlbmVyLmJpbmQodGhpcylcbiAgICB0aGlzLnRocm90dGxlZExpc3RlbmVyID0gdGhpcy50aHJvdHRsZWRMaXN0ZW5lci5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlKClcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICgpIHtcbiAgICB0aGlzLnNjcm9sbFRvcCA9IHRoaXMubGFzdFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgIHRoaXMuc2Nyb2xsUGVyY2VudCA9XG4gICAgICAgICh0aGlzLnNjcm9sbFRvcCAvICh0aGlzLndpbmRvd1NpemUuc2Nyb2xsSGVpZ2h0IC0gdGhpcy53aW5kb3dTaXplLmhlaWdodCkpICogMTAwXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnRcbiAgICB9XG4gIH1cblxuICBkZWJvdW5jZWRMaXN0ZW5lciAoKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICB0aGlzLnNjcm9sbFBlcmNlbnQgPVxuICAgICAgICAodGhpcy5zY3JvbGxUb3AgLyAodGhpcy53aW5kb3dTaXplLnNjcm9sbEhlaWdodCAtIHRoaXMud2luZG93U2l6ZS5oZWlnaHQpKSAqIDEwMFxuXG4gICAgdGhpcy5zaWduYWwoJ3Njcm9sbC5zdGFydCcsIFt7XG4gICAgICBzY3JvbGxUb3A6IHRoaXMuc2Nyb2xsVG9wLFxuICAgICAgc2Nyb2xsUGVyY2VudDogdGhpcy5zY3JvbGxQZXJjZW50XG4gICAgfV0pXG5cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbFRvcFxuICB9XG5cbiAgdGhyb3R0bGVkTGlzdGVuZXIgKCkge1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgdGhpcy5zY3JvbGxQZXJjZW50ID1cbiAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIC8gKHRoaXMud2luZG93U2l6ZS5zY3JvbGxIZWlnaHQgLSB0aGlzLndpbmRvd1NpemUuaGVpZ2h0KSkgKiAxMDBcblxuICAgIGNvbnN0IHNjcm9sbE9iaiA9IHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnRcbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsJywgW3Njcm9sbE9ial0pXG5cbiAgICBpZiAodGhpcy5zY3JvbGxUb3AgPiB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwuZG93bicsIFtzY3JvbGxPYmpdKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zY3JvbGxUb3AgPCB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwudXAnLCBbc2Nyb2xsT2JqXSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxUb3AgPD0gMCkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Njcm9sbC50b3AnLCBbc2Nyb2xsT2JqXSlcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsT2JqLnNjcm9sbFBlcmNlbnQgPj0gMTAwKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLmJvdHRvbScsIFtzY3JvbGxPYmpdKVxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpXG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLnN0b3AnLCBbc2Nyb2xsT2JqXSlcbiAgICB9LCB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXkgKyAxKVxuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3BcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JvbGxFdmVudHNcbiIsImNsYXNzIFJlc2l6ZUV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gbnVsbFxuXG4gICAgdGhpcy5kZWJvdW5jZWRMaXN0ZW5lciA9IHRoaXMuZGVib3VuY2VkTGlzdGVuZXIuYmluZCh0aGlzKVxuICAgIHRoaXMudGhyb3R0bGVkTGlzdGVuZXIgPSB0aGlzLnRocm90dGxlZExpc3RlbmVyLmJpbmQodGhpcylcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5sYXN0SCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIHRoaXMud2lkdGggPSB0aGlzLmxhc3RXID0gd2luZG93LmlubmVyV2lkdGhcbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRoaXMubGFzdFMgPSBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodFxuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLmxhc3RPID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvblxuICAgIH1cbiAgfVxuXG4gIGRlYm91bmNlZExpc3RlbmVyICgpIHtcbiAgICB0aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHRcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnXG5cbiAgICBjb25zdCBzaXplT2JqID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgc2Nyb2xsSGVpZ2h0OiB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uXG4gICAgfVxuXG4gICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zdGFydCcsIFtzaXplT2JqXSlcblxuICAgIHRoaXMubGFzdEggPSB0aGlzLmhlaWdodFxuICAgIHRoaXMubGFzdFcgPSB0aGlzLndpZHRoXG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0XG4gIH1cblxuICB0aHJvdHRsZWRMaXN0ZW5lciAoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMuaGVpZ2h0ID4gdGhpcy53aWR0aCA/ICdwb3J0cmFpdCcgOiAnbGFuZHNjYXBlJ1xuXG4gICAgY29uc3Qgc2l6ZU9iaiA9IHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvblxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsKCdyZXNpemUnLCBbc2l6ZU9ial0pXG5cbiAgICBpZiAodGhpcy5vcmllbnRhdGlvbiAhPT0gdGhpcy5sYXN0Tykge1xuICAgICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5vcmllbnRhdGlvbkNoYW5nZScsIFtzaXplT2JqXSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT09IHRoaXMubGFzdFMpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdyZXNpemUuc2Nyb2xsSGVpZ2h0Q2hhbmdlJywgW3NpemVPYmpdKVxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpXG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNpZ25hbCgncmVzaXplLnN0b3AnLCBbc2l6ZU9ial0pXG4gICAgfSwgdGhpcy5vcHRpb25zLnJlc2l6ZURlbGF5ICsgMSlcblxuICAgIHRoaXMubGFzdEggPSB0aGlzLmhlaWdodFxuICAgIHRoaXMubGFzdFcgPSB0aGlzLndpZHRoXG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0XG4gICAgdGhpcy5sYXN0TyA9IHRoaXMub3JpZW50YXRpb25cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNpemVFdmVudHNcbiIsImNsYXNzIFZpc2liaWxpdHlFdmVudHMge1xuICBjb25zdHJ1Y3RvciAocHVibGlzaGVyLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zaWduYWwgPSBwdWJsaXNoZXIuc2lnbmFsXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5jaGFuZ2VMaXN0ZW50ZXIgPSB0aGlzLmNoYW5nZUxpc3RlbnRlci5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlKClcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICgpIHtcbiAgICB0aGlzLnZpc2libGUgPSAhZG9jdW1lbnQuaGlkZGVuXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc2libGU6IHRoaXMudmlzaWJsZVxuICAgIH1cbiAgfVxuXG4gIGNoYW5nZUxpc3RlbnRlciAoKSB7XG4gICAgdGhpcy52aXNpYmxlID0gIWRvY3VtZW50LmhpZGRlblxuXG4gICAgY29uc3QgdmlzaWJsZU9iaiA9IHtcbiAgICAgIHZpc2libGU6IHRoaXMudmlzaWJsZVxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsKCd2aXNpYmlsaXR5Q2hhbmdlJywgW3Zpc2libGVPYmpdKVxuXG4gICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2Uuc2hvdycsIFt2aXNpYmxlT2JqXSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2UuaGlkZScsIFt2aXNpYmxlT2JqXSlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlzaWJpbGl0eUV2ZW50c1xuIiwiY2xhc3MgTG9hZEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICB0aGlzLmNoYW5nZUxpc3RlbnRlciA9IHRoaXMuY2hhbmdlTGlzdGVudGVyLmJpbmQodGhpcylcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKCkge1xuICAgIHRoaXMubG9hZGVkID0gZG9jdW1lbnQucmVhZHlTdGF0ZVxuICB9XG5cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2FkZWQ6IHRoaXMubG9hZGVkXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlTGlzdGVudGVyICgpIHtcbiAgICB0aGlzLmxvYWRlZCA9IGRvY3VtZW50LnJlYWR5U3RhdGVcblxuICAgIGNvbnN0IGxvYWRlZE9iaiA9IHtcbiAgICAgIGxvYWRlZDogdGhpcy5sb2FkZWRcbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbCgnbG9hZCcsIFtsb2FkZWRPYmpdKVxuXG4gICAgaWYgKHRoaXMubG9hZGVkID09PSAnaW50ZXJhY3RpdmUnKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnbG9hZC5pbnRlcmFjdGl2ZScsIFtsb2FkZWRPYmpdKVxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2FkZWQgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdsb2FkLmNvbXBsZXRlJywgW2xvYWRlZE9ial0pXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRFdmVudHNcbiIsIlxuLyohXG4gKiBXaW5kb3dFdmVudHMuanNcbiAqIEBhdXRob3IgUGV0ZSBEcm9sbCA8ZHJvbGwucEBnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuaW1wb3J0IHB1Ymxpc2hlciBmcm9tICdjb3ZqcydcbmltcG9ydCBkZWJvdW5jZSBmcm9tICd0aHJvdHRsZS1kZWJvdW5jZS9kZWJvdW5jZSdcbmltcG9ydCB0aHJvdHRsZSBmcm9tICd0aHJvdHRsZS1kZWJvdW5jZS90aHJvdHRsZSdcbmltcG9ydCBTY3JvbGxFdmVudHMgZnJvbSAnLi9zY3JvbGwnXG5pbXBvcnQgUmVzaXplRXZlbnRzIGZyb20gJy4vcmVzaXplJ1xuaW1wb3J0IFZpc2liaWxpdHlFdmVudHMgZnJvbSAnLi92aXNpYmlsaXR5J1xuaW1wb3J0IExvYWRFdmVudHMgZnJvbSAnLi9sb2FkJ1xuXG5jbGFzcyBXaW5kb3dFdmVudHMge1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgc2Nyb2xsRGVsYXk6IDEwMCxcbiAgICAgIHJlc2l6ZURlbGF5OiAzNTBcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRzID8geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0cyB9IDogZGVmYXVsdE9wdGlvbnNcbiAgICB0aGlzLm9uID0gcHVibGlzaGVyLm9uXG4gICAgdGhpcy5vbmNlID0gcHVibGlzaGVyLm9uY2VcbiAgICB0aGlzLm9mZiA9IHB1Ymxpc2hlci5vZmZcblxuICAgIGNvbnN0IHJlc2l6ZUV2ZW50cyA9IG5ldyBSZXNpemVFdmVudHMocHVibGlzaGVyLCB0aGlzLm9wdGlvbnMpXG4gICAgLy8gUGFzcyByZXNpemVFdmVudHMgb2JqZWN0IHRvIHNjcm9sbCBsaXN0ZW5lclxuICAgIC8vIGluIG9yZGVyIHRvIGhhdmUgYWNjZXNzIHRvIHdpbmRvdyBoZWlnaHQsIHdpZHRoXG4gICAgY29uc3Qgc2Nyb2xsRXZlbnRzID0gbmV3IFNjcm9sbEV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucywgcmVzaXplRXZlbnRzKVxuICAgIGNvbnN0IHZpc2liaWxpdHlFdmVudHMgPSBuZXcgVmlzaWJpbGl0eUV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucylcbiAgICBjb25zdCBsb2FkRXZlbnRzID0gbmV3IExvYWRFdmVudHMocHVibGlzaGVyLCB0aGlzLm9wdGlvbnMpXG5cbiAgICB0aGlzLmdldFN0YXRlID0gKCkgPT4gKHtcbiAgICAgIC4uLnJlc2l6ZUV2ZW50cy5nZXRTdGF0ZSgpLFxuICAgICAgLi4uc2Nyb2xsRXZlbnRzLmdldFN0YXRlKCksXG4gICAgICAuLi52aXNpYmlsaXR5RXZlbnRzLmdldFN0YXRlKCksXG4gICAgICAuLi5sb2FkRXZlbnRzLmdldFN0YXRlKClcbiAgICB9KVxuXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9ICgpID0+IHtcbiAgICAgIHJlc2l6ZUV2ZW50cy51cGRhdGVTdGF0ZSgpXG4gICAgICBzY3JvbGxFdmVudHMudXBkYXRlU3RhdGUoKVxuICAgICAgdmlzaWJpbGl0eUV2ZW50cy51cGRhdGVTdGF0ZSgpXG4gICAgICBsb2FkRXZlbnRzLnVwZGF0ZVN0YXRlKClcbiAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlKClcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2UoXG4gICAgICAvLyBEZWxheVxuICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbERlbGF5LFxuICAgICAgLy8gQXQgYmVnaW5uaW5nXG4gICAgICB0cnVlLFxuICAgICAgLy8gRGVib3VuY2VkIGZ1bmN0aW9uXG4gICAgICBzY3JvbGxFdmVudHMuZGVib3VuY2VkTGlzdGVuZXJcbiAgICApLCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhyb3R0bGUoXG4gICAgICAvLyBEZWxheVxuICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbERlbGF5LFxuICAgICAgLy8gTm8gVHJhaWxpbmcuIElmIGZhbHNlLCB3aWxsIGdldCBjYWxsZWQgb25lIGxhc3QgdGltZSBhZnRlciB0aGUgbGFzdCB0aHJvdHRsZWQgY2FsbFxuICAgICAgZmFsc2UsXG4gICAgICAvLyBUaHJvdHRsZWQgZnVuY3Rpb25cbiAgICAgIHNjcm9sbEV2ZW50cy50aHJvdHRsZWRMaXN0ZW5lclxuICAgICksIGZhbHNlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkZWJvdW5jZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMucmVzaXplRGVsYXksXG4gICAgICAvLyBBdCBiZWdpbm5pbmdcbiAgICAgIHRydWUsXG4gICAgICAvLyBEZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgIHJlc2l6ZUV2ZW50cy5kZWJvdW5jZWRMaXN0ZW5lclxuICAgICksIGZhbHNlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aHJvdHRsZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMucmVzaXplRGVsYXksXG4gICAgICAvLyBObyBUcmFpbGluZy4gSWYgZmFsc2UsIHdpbGwgZ2V0IGNhbGxlZCBvbmUgbGFzdCB0aW1lIGFmdGVyIHRoZSBsYXN0IHRocm90dGxlZCBjYWxsXG4gICAgICBmYWxzZSxcbiAgICAgIC8vIFRocm90dGxlZCBmdW5jdGlvblxuICAgICAgcmVzaXplRXZlbnRzLnRocm90dGxlZExpc3RlbmVyXG4gICAgKSwgZmFsc2UpXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHZpc2liaWxpdHlFdmVudHMuY2hhbmdlTGlzdGVudGVyLCBmYWxzZSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBVcGRhdGUgdGhlIHN0YXRlIG9uY2UgYWxsXG4gICAgICAvLyBpbWFnZXMgYW5kIHJlc291cmNlcyBoYXZlIGxvYWRlZFxuICAgICAgdGhpcy51cGRhdGVTdGF0ZSgpXG4gICAgICBsb2FkRXZlbnRzLmNoYW5nZUxpc3RlbnRlcigpXG4gICAgfSwgZmFsc2UpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2luZG93RXZlbnRzXG4iXSwibmFtZXMiOlsiX2lzRm4iLCJmbiIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImNhbGxiYWNrSWQiLCJjb3ZlbmFudHMiLCJDb3YiLCJvbiIsIm5hbWUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJpc0ZuIiwiX2V4aXN0cyIsImNiT2JqIiwiaWQiLCJmb3JFYWNoIiwiY292IiwiY2FsbGJhY2tzIiwicHVzaCIsIm5ld0NvdmVuYW50Iiwib25jZSIsIm5ld0lkIiwib25lVGltZUZ1bmMiLCJhcHBseSIsIm9mZiIsImJpbmQiLCJzaWduYWwiLCJhcmdzIiwiaW5kZXgiLCJhcnIiLCJzcGxpY2UiLCJpeCIsImRlbGF5Iiwibm9UcmFpbGluZyIsImNhbGxiYWNrIiwiZGVib3VuY2VNb2RlIiwidGltZW91dElEIiwibGFzdEV4ZWMiLCJ3cmFwcGVyIiwic2VsZiIsImVsYXBzZWQiLCJOdW1iZXIiLCJEYXRlIiwiZXhlYyIsImNsZWFyIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImF0QmVnaW4iLCJ0aHJvdHRsZSIsIlNjcm9sbEV2ZW50cyIsInB1Ymxpc2hlciIsIm9wdGlvbnMiLCJzaXplUmVmIiwid2luZG93U2l6ZSIsInNjcm9sbFRpbWVvdXQiLCJkZWJvdW5jZWRMaXN0ZW5lciIsInRocm90dGxlZExpc3RlbmVyIiwidXBkYXRlU3RhdGUiLCJzY3JvbGxUb3AiLCJsYXN0U2Nyb2xsVG9wIiwid2luZG93Iiwic2Nyb2xsWSIsInBhZ2VZT2Zmc2V0Iiwic2Nyb2xsUGVyY2VudCIsInNjcm9sbEhlaWdodCIsImhlaWdodCIsInNjcm9sbE9iaiIsInNjcm9sbERlbGF5IiwiUmVzaXplRXZlbnRzIiwicmVzaXplVGltZW91dCIsImxhc3RIIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImxhc3RXIiwiaW5uZXJXaWR0aCIsImxhc3RTIiwiZG9jdW1lbnQiLCJib2R5Iiwib3JpZW50YXRpb24iLCJsYXN0TyIsInNpemVPYmoiLCJyZXNpemVEZWxheSIsIlZpc2liaWxpdHlFdmVudHMiLCJjaGFuZ2VMaXN0ZW50ZXIiLCJ2aXNpYmxlIiwiaGlkZGVuIiwidmlzaWJsZU9iaiIsIkxvYWRFdmVudHMiLCJsb2FkZWQiLCJyZWFkeVN0YXRlIiwibG9hZGVkT2JqIiwiV2luZG93RXZlbnRzIiwib3B0cyIsImRlZmF1bHRPcHRpb25zIiwicmVzaXplRXZlbnRzIiwic2Nyb2xsRXZlbnRzIiwidmlzaWJpbGl0eUV2ZW50cyIsImxvYWRFdmVudHMiLCJnZXRTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJkZWJvdW5jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBSUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBU0EsS0FBVCxD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
