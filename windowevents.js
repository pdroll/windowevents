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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93ZXZlbnRzLmpzIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvY292anMvY292LmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL3Rocm90dGxlLmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL2RlYm91bmNlLmpzIiwic3JjL3Njcm9sbC5qcyIsInNyYy9yZXNpemUuanMiLCJzcmMvdmlzaWJpbGl0eS5qcyIsInNyYy9sb2FkLmpzIiwic3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBEYXZlIERldm9yIDxkYXZlZGV2b3JAZ21haWwuY29tPlxuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgdmFyaWFibGUgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKlxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIF9pc0ZuKGZuKSB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIFN0b3JlIGluY3JlbWVudGluZyBJRCBmb3IgZWFjaCBwYXNzZWQgY2FsbGJhY2tcbiAqIEB0eXBlICB7SW50fVxuICovXG52YXIgY2FsbGJhY2tJZCA9IDA7XG5cbi8qKlxuICogU3RvcmUgYWxsIG9mIG91ciBjb3ZlbmFudHNcbiAqIEB0eXBlICB7QXJyYXl9XG4gKi9cbnZhciBjb3ZlbmFudHMgPSBbXTtcblxuLyoqXG4gKiBPbmUgb2JqZWN0IHRvIGhvbGQgYWxsIG9mIHRoZSBhcHBzIGNvdmVuYW50cy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBDb3YgPSB7XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGFuIGV2ZW50LCBvciBhZGQgdG8gYW4gZXhpc3RpbmcgZXZlbnRcblx0ICogQHBhcmFtICAge1N0cmluZ30gIG5hbWUgICAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCdcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgVGhlIGNsb3N1cmUgdG8gZXhlY3V0ZSB3aGVuIHNpZ25hbGVkLlxuXHQgKiBAcmV0dXJuICB7TWl4ZWR9ICAgICAgICAgICBVbmlxdWUgSUQgZm9yIGxpc3RlbmVyIG9yIGZhbHNlIG9uIGluY29ycmVjdCBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRvbjogZnVuY3Rpb24gb24oKSB7XG5cdFx0dmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1swXTtcblx0XHR2YXIgZm4gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgZm4gaXMgYSBmdW5jdGlvblxuXHRcdHZhciBpc0ZuID0gX2lzRm4oZm4pO1xuXG5cdFx0aWYgKG5hbWUgJiYgZm4gJiYgaXNGbikge1xuXHRcdFx0dmFyIF9leGlzdHMgPSBmYWxzZTtcblx0XHRcdHZhciBjYk9iaiA9IHtcblx0XHRcdFx0aWQ6ICdjb3ZfJyArICgrK2NhbGxiYWNrSWQpLFxuXHRcdFx0XHRmbjogZm5cblx0XHRcdH1cblxuXHRcdFx0Ly8gY2hlY2sgaWYgdGhpcyBldmVuIGV4aXN0c1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdikge1xuXHRcdFx0XHQvLyBJZiBpdCBhbHJlYWR5IGV4aXN0cywgYWRkIHRoZSBmdW5jdGlvbiB0byBpdHMgZnVuY3Rpb25zLlxuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLnB1c2goY2JPYmopO1xuXHRcdFx0XHRcdF9leGlzdHMgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIElmIGl0IGRvZXNudCBleGlzdCBjcmVhdGUgaXQuXG5cdFx0XHRpZiAoIV9leGlzdHMpIHtcblx0XHRcdFx0dmFyIG5ld0NvdmVuYW50ID0ge1xuXHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0Y2FsbGJhY2tzOiBbY2JPYmpdXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Y292ZW5hbnRzLnB1c2gobmV3Q292ZW5hbnQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNiT2JqLmlkO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgYW4gZXZlbnQgdG8gZmlyZSBvbmx5IG9uY2Vcblx0ICogQHBhcmFtICAge1N0cmluZ30gIG5hbWUgICAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCdcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgVGhlIGNsb3N1cmUgdG8gZXhlY3V0ZSB3aGVuIHNpZ25hbGVkLlxuXHQgKiBAcmV0dXJuICB7TWl4ZWR9ICAgICAgICAgICBVbmlxdWUgSUQgZm9yIGxpc3RlbmVyIG9yIGZhbHNlIG9uIGluY29ycmVjdCBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRvbmNlOiBmdW5jdGlvbiBvbmNlKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGZuID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHR2YXIgbmV3SWQgPSAnY292XycgKyAoY2FsbGJhY2tJZCArIDEpO1xuXHRcdHZhciBvbmVUaW1lRnVuYyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0XHRcdHRoaXMub2ZmKG5hbWUsIG5ld0lkKTtcblx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLm9uKG5hbWUsIG9uZVRpbWVGdW5jKTtcblxuXHRcdHJldHVybiBuZXdJZDtcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBTaWduYWwgYW4gZXZlbnQgYW5kIHJ1biBhbGwgb2YgaXRzIHN1YnNjcmliZWQgZnVuY3Rpb25zLlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICAgIG5hbWUgIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnO1xuXHQgKiBAcGFyYW0gIHtvYmplY3RbXX0gIGFyZ3MgIEFueSBhcmd1bWVudHMgdGhhdCBuZWVkIHRvIGJlIHNlbnQgdG8gdGhlICBmblxuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgIEN1cnJlbnQgaW5zdGFuY2Ugb2YgQ292LCB0byBhbGxvdyBmb3IgY2hhaW5pbmdcblx0ICovXG5cdHNpZ25hbDogZnVuY3Rpb24gc2lnbmFsKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1sxXTtcblxuXG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YpIHtcblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNiT2JqKSB7XG5cdFx0XHRcdFx0XHRjYk9iai5mbi5hcHBseShudWxsLCBhcmdzKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblxuXHQvKipcblx0ICogVW5yZWdpc3RlciAodHVybiBvZmYpIGFuIGV2ZW50LlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJztcblx0ICogQHBhcmFtICB7U3RyaW5nfSAgSUQgb2YgbGlzdGVuZXIgYXMgcmV0dXJuZWQgYnkgYG9uYCBmdW5jdGlvblxuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICBDdXJyZW50IGluc3RhbmNlIG9mIENvdiwgdG8gYWxsb3cgZm9yIGNoYWluaW5nXG5cdCAqL1xuXHRvZmY6IGZ1bmN0aW9uIG9mZigpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBpZCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YsIGluZGV4LCBhcnIpIHtcblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0Ly8gSWYgbm8gSUQgaXMgcGFzc2VkLCByZW1vdmUgYWxsIGxpc3RlbmVyc1xuXHRcdFx0XHRcdGlmICghaWQpIHtcblx0XHRcdFx0XHRcdGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGp1c3QgcmVtb3ZlIHNwZWNpZmllZCBjYWxsYmFja1xuXHRcdFx0XHRcdFx0Y292LmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNiT2JqLCBpeCwgY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjYk9iai5pZCA9PT0gaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFja3Muc3BsaWNlKGl4LCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ292O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWZpbmVkLG5vLXBhcmFtLXJlYXNzaWduLG5vLXNoYWRvdyAqL1xuXG4vKipcbiAqIFRocm90dGxlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgcmF0ZSBsaW1pdGluZ1xuICogZXhlY3V0aW9uIG9mIGhhbmRsZXJzIG9uIGV2ZW50cyBsaWtlIHJlc2l6ZSBhbmQgc2Nyb2xsLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gICAgZGVsYXkgICAgICAgICAgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnQgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgIFtub1RyYWlsaW5nXSAgIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgbm9UcmFpbGluZyBpcyB0cnVlLCBjYWxsYmFjayB3aWxsIG9ubHkgZXhlY3V0ZSBldmVyeSBgZGVsYXlgIG1pbGxpc2Vjb25kcyB3aGlsZSB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZC4gSWYgbm9UcmFpbGluZyBpcyBmYWxzZSBvciB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmUgZmluYWwgdGltZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlciB0aGUgbGFzdCB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICogQHBhcmFtICB7RnVuY3Rpb259ICBjYWxsYmFjayAgICAgICBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy4gVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGBjYWxsYmFja2Agd2hlbiB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gICBbZGVib3VuY2VNb2RlXSBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLiBJZiBgZGVib3VuY2VNb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259ICBBIG5ldywgdGhyb3R0bGVkLCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIGRlbGF5LCBub1RyYWlsaW5nLCBjYWxsYmFjaywgZGVib3VuY2VNb2RlICkge1xuXG5cdC8vIEFmdGVyIHdyYXBwZXIgaGFzIHN0b3BwZWQgYmVpbmcgY2FsbGVkLCB0aGlzIHRpbWVvdXQgZW5zdXJlcyB0aGF0XG5cdC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxuXHQvLyBkZWJvdW5jZSBtb2Rlcy5cblx0dmFyIHRpbWVvdXRJRDtcblxuXHQvLyBLZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHRpbWUgYGNhbGxiYWNrYCB3YXMgZXhlY3V0ZWQuXG5cdHZhciBsYXN0RXhlYyA9IDA7XG5cblx0Ly8gYG5vVHJhaWxpbmdgIGRlZmF1bHRzIHRvIGZhbHN5LlxuXHRpZiAoIHR5cGVvZiBub1RyYWlsaW5nICE9PSAnYm9vbGVhbicgKSB7XG5cdFx0ZGVib3VuY2VNb2RlID0gY2FsbGJhY2s7XG5cdFx0Y2FsbGJhY2sgPSBub1RyYWlsaW5nO1xuXHRcdG5vVHJhaWxpbmcgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyBUaGUgYHdyYXBwZXJgIGZ1bmN0aW9uIGVuY2Fwc3VsYXRlcyBhbGwgb2YgdGhlIHRocm90dGxpbmcgLyBkZWJvdW5jaW5nXG5cdC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXG5cdC8vIGlzIGV4ZWN1dGVkLlxuXHRmdW5jdGlvbiB3cmFwcGVyICgpIHtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgZWxhcHNlZCA9IE51bWJlcihuZXcgRGF0ZSgpKSAtIGxhc3RFeGVjO1xuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG5cdFx0Ly8gRXhlY3V0ZSBgY2FsbGJhY2tgIGFuZCB1cGRhdGUgdGhlIGBsYXN0RXhlY2AgdGltZXN0YW1wLlxuXHRcdGZ1bmN0aW9uIGV4ZWMgKCkge1xuXHRcdFx0bGFzdEV4ZWMgPSBOdW1iZXIobmV3IERhdGUoKSk7XG5cdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbikgdGhpcyBpcyB1c2VkIHRvIGNsZWFyIHRoZSBmbGFnXG5cdFx0Ly8gdG8gYWxsb3cgZnV0dXJlIGBjYWxsYmFja2AgZXhlY3V0aW9ucy5cblx0XHRmdW5jdGlvbiBjbGVhciAoKSB7XG5cdFx0XHR0aW1lb3V0SUQgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBkZWJvdW5jZU1vZGUgJiYgIXRpbWVvdXRJRCApIHtcblx0XHRcdC8vIFNpbmNlIGB3cmFwcGVyYCBpcyBiZWluZyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGFuZFxuXHRcdFx0Ly8gYGRlYm91bmNlTW9kZWAgaXMgdHJ1ZSAoYXQgYmVnaW4pLCBleGVjdXRlIGBjYWxsYmFja2AuXG5cdFx0XHRleGVjKCk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuXG5cdFx0aWYgKCB0aW1lb3V0SUQgKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dElEKTtcblx0XHR9XG5cblx0XHRpZiAoIGRlYm91bmNlTW9kZSA9PT0gdW5kZWZpbmVkICYmIGVsYXBzZWQgPiBkZWxheSApIHtcblx0XHRcdC8vIEluIHRocm90dGxlIG1vZGUsIGlmIGBkZWxheWAgdGltZSBoYXMgYmVlbiBleGNlZWRlZCwgZXhlY3V0ZVxuXHRcdFx0Ly8gYGNhbGxiYWNrYC5cblx0XHRcdGV4ZWMoKTtcblxuXHRcdH0gZWxzZSBpZiAoIG5vVHJhaWxpbmcgIT09IHRydWUgKSB7XG5cdFx0XHQvLyBJbiB0cmFpbGluZyB0aHJvdHRsZSBtb2RlLCBzaW5jZSBgZGVsYXlgIHRpbWUgaGFzIG5vdCBiZWVuXG5cdFx0XHQvLyBleGNlZWRlZCwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGBkZWxheWAgbXMgYWZ0ZXIgbW9zdFxuXHRcdFx0Ly8gcmVjZW50IGV4ZWN1dGlvbi5cblx0XHRcdC8vXG5cdFx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZVxuXHRcdFx0Ly8gYWZ0ZXIgYGRlbGF5YCBtcy5cblx0XHRcdC8vXG5cdFx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0b1xuXHRcdFx0Ly8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLlxuXHRcdFx0dGltZW91dElEID0gc2V0VGltZW91dChkZWJvdW5jZU1vZGUgPyBjbGVhciA6IGV4ZWMsIGRlYm91bmNlTW9kZSA9PT0gdW5kZWZpbmVkID8gZGVsYXkgLSBlbGFwc2VkIDogZGVsYXkpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuXHRyZXR1cm4gd3JhcHBlcjtcblxufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmaW5lZCAqL1xuXG52YXIgdGhyb3R0bGUgPSByZXF1aXJlKCcuL3Rocm90dGxlJyk7XG5cbi8qKlxuICogRGVib3VuY2UgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIERlYm91bmNpbmcsIHVubGlrZSB0aHJvdHRsaW5nLFxuICogZ3VhcmFudGVlcyB0aGF0IGEgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBhIHNpbmdsZSB0aW1lLCBlaXRoZXIgYXQgdGhlXG4gKiB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNlcmllcyBvZiBjYWxscywgb3IgYXQgdGhlIHZlcnkgZW5kLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gICBkZWxheSAgICAgICAgIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50IGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gIFthdEJlZ2luXSAgICAgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBhdEJlZ2luIGlzIGZhbHNlIG9yIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYGRlbGF5YCBtaWxsaXNlY29uZHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyIHRoZSBsYXN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiBJZiBhdEJlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25seSBhdCB0aGUgZmlyc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpLlxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrICAgICAgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBkZWxheSwgYXRCZWdpbiwgY2FsbGJhY2sgKSB7XG5cdHJldHVybiBjYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gdGhyb3R0bGUoZGVsYXksIGF0QmVnaW4sIGZhbHNlKSA6IHRocm90dGxlKGRlbGF5LCBjYWxsYmFjaywgYXRCZWdpbiAhPT0gZmFsc2UpO1xufTtcbiIsImNsYXNzIFNjcm9sbEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMsIHNpemVSZWYpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2l6ZVJlZlxuICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IG51bGxcblxuICAgIHRoaXMuZGVib3VuY2VkTGlzdGVuZXIgPSB0aGlzLmRlYm91bmNlZExpc3RlbmVyLmJpbmQodGhpcylcbiAgICB0aGlzLnRocm90dGxlZExpc3RlbmVyID0gdGhpcy50aHJvdHRsZWRMaXN0ZW5lci5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlKClcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICgpIHtcbiAgICB0aGlzLnNjcm9sbFRvcCA9IHRoaXMubGFzdFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgIHRoaXMuc2Nyb2xsUGVyY2VudCA9XG4gICAgICAgICh0aGlzLnNjcm9sbFRvcCAvICh0aGlzLndpbmRvd1NpemUuc2Nyb2xsSGVpZ2h0IC0gdGhpcy53aW5kb3dTaXplLmhlaWdodCkpICogMTAwXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnRcbiAgICB9XG4gIH1cblxuICBkZWJvdW5jZWRMaXN0ZW5lciAoKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICB0aGlzLnNjcm9sbFBlcmNlbnQgPVxuICAgICAgICAodGhpcy5zY3JvbGxUb3AgLyAodGhpcy53aW5kb3dTaXplLnNjcm9sbEhlaWdodCAtIHRoaXMud2luZG93U2l6ZS5oZWlnaHQpKSAqIDEwMFxuXG4gICAgdGhpcy5zaWduYWwoJ3Njcm9sbC5zdGFydCcsIFt7XG4gICAgICBzY3JvbGxUb3A6IHRoaXMuc2Nyb2xsVG9wLFxuICAgICAgc2Nyb2xsUGVyY2VudDogdGhpcy5zY3JvbGxQZXJjZW50XG4gICAgfV0pXG5cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbFRvcFxuICB9XG5cbiAgdGhyb3R0bGVkTGlzdGVuZXIgKCkge1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgdGhpcy5zY3JvbGxQZXJjZW50ID1cbiAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIC8gKHRoaXMud2luZG93U2l6ZS5zY3JvbGxIZWlnaHQgLSB0aGlzLndpbmRvd1NpemUuaGVpZ2h0KSkgKiAxMDBcblxuICAgIGNvbnN0IHNjcm9sbE9iaiA9IHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnRcbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsJywgW3Njcm9sbE9ial0pXG5cbiAgICBpZiAodGhpcy5zY3JvbGxUb3AgPiB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwuZG93bicsIFtzY3JvbGxPYmpdKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zY3JvbGxUb3AgPCB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwudXAnLCBbc2Nyb2xsT2JqXSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxUb3AgPD0gMCkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Njcm9sbC50b3AnLCBbc2Nyb2xsT2JqXSlcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsT2JqLnNjcm9sbFBlcmNlbnQgPj0gMTAwKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLmJvdHRvbScsIFtzY3JvbGxPYmpdKVxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpXG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLnN0b3AnLCBbc2Nyb2xsT2JqXSlcbiAgICB9LCB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXkgKyAxKVxuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3BcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JvbGxFdmVudHNcbiIsImNsYXNzIFJlc2l6ZUV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gbnVsbFxuXG4gICAgdGhpcy5kZWJvdW5jZWRMaXN0ZW5lciA9IHRoaXMuZGVib3VuY2VkTGlzdGVuZXIuYmluZCh0aGlzKVxuICAgIHRoaXMudGhyb3R0bGVkTGlzdGVuZXIgPSB0aGlzLnRocm90dGxlZExpc3RlbmVyLmJpbmQodGhpcylcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5sYXN0SCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIHRoaXMud2lkdGggPSB0aGlzLmxhc3RXID0gd2luZG93LmlubmVyV2lkdGhcbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRoaXMubGFzdFMgPSBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodFxuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLmxhc3RPID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvblxuICAgIH1cbiAgfVxuXG4gIGRlYm91bmNlZExpc3RlbmVyICgpIHtcbiAgICB0aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHRcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnXG5cbiAgICBjb25zdCBzaXplT2JqID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgc2Nyb2xsSGVpZ2h0OiB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uXG4gICAgfVxuXG4gICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zdGFydCcsIFtzaXplT2JqXSlcblxuICAgIHRoaXMubGFzdEggPSB0aGlzLmhlaWdodFxuICAgIHRoaXMubGFzdFcgPSB0aGlzLndpZHRoXG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0XG4gIH1cblxuICB0aHJvdHRsZWRMaXN0ZW5lciAoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMuaGVpZ2h0ID4gdGhpcy53aWR0aCA/ICdwb3J0cmFpdCcgOiAnbGFuZHNjYXBlJ1xuXG4gICAgY29uc3Qgc2l6ZU9iaiA9IHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvblxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsKCdyZXNpemUnLCBbc2l6ZU9ial0pXG5cbiAgICBpZiAodGhpcy5vcmllbnRhdGlvbiAhPT0gdGhpcy5sYXN0Tykge1xuICAgICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5vcmllbnRhdGlvbkNoYW5nZScsIFtzaXplT2JqXSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT09IHRoaXMubGFzdFMpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdyZXNpemUuc2Nyb2xsSGVpZ2h0Q2hhbmdlJywgW3NpemVPYmpdKVxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpXG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNpZ25hbCgncmVzaXplLnN0b3AnLCBbc2l6ZU9ial0pXG4gICAgfSwgdGhpcy5vcHRpb25zLnJlc2l6ZURlbGF5ICsgMSlcblxuICAgIHRoaXMubGFzdEggPSB0aGlzLmhlaWdodFxuICAgIHRoaXMubGFzdFcgPSB0aGlzLndpZHRoXG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0XG4gICAgdGhpcy5sYXN0TyA9IHRoaXMub3JpZW50YXRpb25cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNpemVFdmVudHNcbiIsImNsYXNzIFZpc2liaWxpdHlFdmVudHMge1xuICBjb25zdHJ1Y3RvciAocHVibGlzaGVyLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zaWduYWwgPSBwdWJsaXNoZXIuc2lnbmFsXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5jaGFuZ2VMaXN0ZW50ZXIgPSB0aGlzLmNoYW5nZUxpc3RlbnRlci5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlKClcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICgpIHtcbiAgICB0aGlzLnZpc2libGUgPSAhZG9jdW1lbnQuaGlkZGVuXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc2libGU6IHRoaXMudmlzaWJsZVxuICAgIH1cbiAgfVxuXG4gIGNoYW5nZUxpc3RlbnRlciAoKSB7XG4gICAgdGhpcy52aXNpYmxlID0gIWRvY3VtZW50LmhpZGRlblxuXG4gICAgY29uc3QgdmlzaWJsZU9iaiA9IHtcbiAgICAgIHZpc2libGU6IHRoaXMudmlzaWJsZVxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsKCd2aXNpYmlsaXR5Q2hhbmdlJywgW3Zpc2libGVPYmpdKVxuXG4gICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2Uuc2hvdycsIFt2aXNpYmxlT2JqXSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2UuaGlkZScsIFt2aXNpYmxlT2JqXSlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlzaWJpbGl0eUV2ZW50c1xuIiwiY2xhc3MgTG9hZEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICB0aGlzLmNoYW5nZUxpc3RlbnRlciA9IHRoaXMuY2hhbmdlTGlzdGVudGVyLmJpbmQodGhpcylcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKCkge1xuICAgIHRoaXMubG9hZGVkID0gZG9jdW1lbnQucmVhZHlTdGF0ZVxuICB9XG5cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2FkZWQ6IHRoaXMubG9hZGVkXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlTGlzdGVudGVyICgpIHtcbiAgICB0aGlzLmxvYWRlZCA9IGRvY3VtZW50LnJlYWR5U3RhdGVcblxuICAgIGNvbnN0IGxvYWRlZE9iaiA9IHtcbiAgICAgIGxvYWRlZDogdGhpcy5sb2FkZWRcbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbCgnbG9hZCcsIFtsb2FkZWRPYmpdKVxuXG4gICAgaWYgKHRoaXMubG9hZGVkID09PSAnaW50ZXJhY3RpdmUnKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnbG9hZC5pbnRlcmFjdGl2ZScsIFtsb2FkZWRPYmpdKVxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2FkZWQgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdsb2FkLmNvbXBsZXRlJywgW2xvYWRlZE9ial0pXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRFdmVudHNcbiIsIi8qIVxuICogV2luZG93RXZlbnRzLmpzXG4gKiBAYXV0aG9yIFBldGUgRHJvbGwgPGRyb2xsLnBAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmltcG9ydCBwdWJsaXNoZXIgZnJvbSAnY292anMnXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvZGVib3VuY2UnXG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvdGhyb3R0bGUnXG5pbXBvcnQgU2Nyb2xsRXZlbnRzIGZyb20gJy4vc2Nyb2xsJ1xuaW1wb3J0IFJlc2l6ZUV2ZW50cyBmcm9tICcuL3Jlc2l6ZSdcbmltcG9ydCBWaXNpYmlsaXR5RXZlbnRzIGZyb20gJy4vdmlzaWJpbGl0eSdcbmltcG9ydCBMb2FkRXZlbnRzIGZyb20gJy4vbG9hZCdcblxuY2xhc3MgV2luZG93RXZlbnRzIHtcbiAgY29uc3RydWN0b3IgKG9wdHMpIHtcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIHNjcm9sbERlbGF5OiAxMDAsXG4gICAgICByZXNpemVEZWxheTogMzUwXG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0cyA/IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdHMgfSA6IGRlZmF1bHRPcHRpb25zXG4gICAgdGhpcy5vbiA9IHB1Ymxpc2hlci5vblxuICAgIHRoaXMub25jZSA9IHB1Ymxpc2hlci5vbmNlXG4gICAgdGhpcy5vZmYgPSBwdWJsaXNoZXIub2ZmXG5cbiAgICBjb25zdCByZXNpemVFdmVudHMgPSBuZXcgUmVzaXplRXZlbnRzKHB1Ymxpc2hlciwgdGhpcy5vcHRpb25zKVxuICAgIC8vIFBhc3MgcmVzaXplRXZlbnRzIG9iamVjdCB0byBzY3JvbGwgbGlzdGVuZXJcbiAgICAvLyBpbiBvcmRlciB0byBoYXZlIGFjY2VzcyB0byB3aW5kb3cgaGVpZ2h0LCB3aWR0aFxuICAgIGNvbnN0IHNjcm9sbEV2ZW50cyA9IG5ldyBTY3JvbGxFdmVudHMocHVibGlzaGVyLCB0aGlzLm9wdGlvbnMsIHJlc2l6ZUV2ZW50cylcbiAgICBjb25zdCB2aXNpYmlsaXR5RXZlbnRzID0gbmV3IFZpc2liaWxpdHlFdmVudHMocHVibGlzaGVyLCB0aGlzLm9wdGlvbnMpXG4gICAgY29uc3QgbG9hZEV2ZW50cyA9IG5ldyBMb2FkRXZlbnRzKHB1Ymxpc2hlciwgdGhpcy5vcHRpb25zKVxuXG4gICAgdGhpcy5nZXRTdGF0ZSA9ICgpID0+ICh7XG4gICAgICAuLi5yZXNpemVFdmVudHMuZ2V0U3RhdGUoKSxcbiAgICAgIC4uLnNjcm9sbEV2ZW50cy5nZXRTdGF0ZSgpLFxuICAgICAgLi4udmlzaWJpbGl0eUV2ZW50cy5nZXRTdGF0ZSgpLFxuICAgICAgLi4ubG9hZEV2ZW50cy5nZXRTdGF0ZSgpXG4gICAgfSlcblxuICAgIHRoaXMudXBkYXRlU3RhdGUgPSAoKSA9PiB7XG4gICAgICByZXNpemVFdmVudHMudXBkYXRlU3RhdGUoKVxuICAgICAgc2Nyb2xsRXZlbnRzLnVwZGF0ZVN0YXRlKClcbiAgICAgIHZpc2liaWxpdHlFdmVudHMudXBkYXRlU3RhdGUoKVxuICAgICAgbG9hZEV2ZW50cy51cGRhdGVTdGF0ZSgpXG4gICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSgpXG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlKFxuICAgICAgLy8gRGVsYXlcbiAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxEZWxheSxcbiAgICAgIC8vIEF0IGJlZ2lubmluZ1xuICAgICAgdHJ1ZSxcbiAgICAgIC8vIERlYm91bmNlZCBmdW5jdGlvblxuICAgICAgc2Nyb2xsRXZlbnRzLmRlYm91bmNlZExpc3RlbmVyXG4gICAgKSwgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRocm90dGxlKFxuICAgICAgLy8gRGVsYXlcbiAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxEZWxheSxcbiAgICAgIC8vIE5vIFRyYWlsaW5nLiBJZiBmYWxzZSwgd2lsbCBnZXQgY2FsbGVkIG9uZSBsYXN0IHRpbWUgYWZ0ZXIgdGhlIGxhc3QgdGhyb3R0bGVkIGNhbGxcbiAgICAgIGZhbHNlLFxuICAgICAgLy8gVGhyb3R0bGVkIGZ1bmN0aW9uXG4gICAgICBzY3JvbGxFdmVudHMudGhyb3R0bGVkTGlzdGVuZXJcbiAgICApLCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZGVib3VuY2UoXG4gICAgICAvLyBEZWxheVxuICAgICAgdGhpcy5vcHRpb25zLnJlc2l6ZURlbGF5LFxuICAgICAgLy8gQXQgYmVnaW5uaW5nXG4gICAgICB0cnVlLFxuICAgICAgLy8gRGVib3VuY2VkIGZ1bmN0aW9uXG4gICAgICByZXNpemVFdmVudHMuZGVib3VuY2VkTGlzdGVuZXJcbiAgICApLCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhyb3R0bGUoXG4gICAgICAvLyBEZWxheVxuICAgICAgdGhpcy5vcHRpb25zLnJlc2l6ZURlbGF5LFxuICAgICAgLy8gTm8gVHJhaWxpbmcuIElmIGZhbHNlLCB3aWxsIGdldCBjYWxsZWQgb25lIGxhc3QgdGltZSBhZnRlciB0aGUgbGFzdCB0aHJvdHRsZWQgY2FsbFxuICAgICAgZmFsc2UsXG4gICAgICAvLyBUaHJvdHRsZWQgZnVuY3Rpb25cbiAgICAgIHJlc2l6ZUV2ZW50cy50aHJvdHRsZWRMaXN0ZW5lclxuICAgICksIGZhbHNlKVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB2aXNpYmlsaXR5RXZlbnRzLmNoYW5nZUxpc3RlbnRlciwgZmFsc2UpXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8gVXBkYXRlIHRoZSBzdGF0ZSBvbmNlIGFsbFxuICAgICAgLy8gaW1hZ2VzIGFuZCByZXNvdXJjZXMgaGF2ZSBsb2FkZWRcbiAgICAgIHRoaXMudXBkYXRlU3RhdGUoKVxuICAgICAgbG9hZEV2ZW50cy5jaGFuZ2VMaXN0ZW50ZXIoKVxuICAgIH0sIGZhbHNlKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdpbmRvd0V2ZW50c1xuIl0sIm5hbWVzIjpbIl9pc0ZuIiwiZm4iLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJjYWxsYmFja0lkIiwiY292ZW5hbnRzIiwiQ292Iiwib24iLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiaXNGbiIsIl9leGlzdHMiLCJjYk9iaiIsImlkIiwiZm9yRWFjaCIsImNvdiIsImNhbGxiYWNrcyIsInB1c2giLCJuZXdDb3ZlbmFudCIsIm9uY2UiLCJuZXdJZCIsIm9uZVRpbWVGdW5jIiwiYXBwbHkiLCJvZmYiLCJiaW5kIiwic2lnbmFsIiwiYXJncyIsImluZGV4IiwiYXJyIiwic3BsaWNlIiwiaXgiLCJkZWxheSIsIm5vVHJhaWxpbmciLCJjYWxsYmFjayIsImRlYm91bmNlTW9kZSIsInRpbWVvdXRJRCIsImxhc3RFeGVjIiwid3JhcHBlciIsInNlbGYiLCJlbGFwc2VkIiwiTnVtYmVyIiwiRGF0ZSIsImV4ZWMiLCJjbGVhciIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJhdEJlZ2luIiwidGhyb3R0bGUiLCJTY3JvbGxFdmVudHMiLCJwdWJsaXNoZXIiLCJvcHRpb25zIiwic2l6ZVJlZiIsIndpbmRvd1NpemUiLCJzY3JvbGxUaW1lb3V0IiwiZGVib3VuY2VkTGlzdGVuZXIiLCJ0aHJvdHRsZWRMaXN0ZW5lciIsInVwZGF0ZVN0YXRlIiwic2Nyb2xsVG9wIiwibGFzdFNjcm9sbFRvcCIsIndpbmRvdyIsInNjcm9sbFkiLCJwYWdlWU9mZnNldCIsInNjcm9sbFBlcmNlbnQiLCJzY3JvbGxIZWlnaHQiLCJoZWlnaHQiLCJzY3JvbGxPYmoiLCJzY3JvbGxEZWxheSIsIlJlc2l6ZUV2ZW50cyIsInJlc2l6ZVRpbWVvdXQiLCJsYXN0SCIsImlubmVySGVpZ2h0Iiwid2lkdGgiLCJsYXN0VyIsImlubmVyV2lkdGgiLCJsYXN0UyIsImRvY3VtZW50IiwiYm9keSIsIm9yaWVudGF0aW9uIiwibGFzdE8iLCJzaXplT2JqIiwicmVzaXplRGVsYXkiLCJWaXNpYmlsaXR5RXZlbnRzIiwiY2hhbmdlTGlzdGVudGVyIiwidmlzaWJsZSIsImhpZGRlbiIsInZpc2libGVPYmoiLCJMb2FkRXZlbnRzIiwibG9hZGVkIiwicmVhZHlTdGF0ZSIsImxvYWRlZE9iaiIsIldpbmRvd0V2ZW50cyIsIm9wdHMiLCJkZWZhdWx0T3B0aW9ucyIsInJlc2l6ZUV2ZW50cyIsInNjcm9sbEV2ZW50cyIsInZpc2liaWxpdHlFdmVudHMiLCJsb2FkRXZlbnRzIiwiZ2V0U3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZGVib3VuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUlBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVNBLEtBQVQsQ0FB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
