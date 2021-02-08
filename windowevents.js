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
   * Constuctor to create an object to hold all of the apps covenants.
   * @type {Function}
   */
  function Covenant() {
    /**
     * Checks if a variable is a function
     * @param  {Function} fn
     *
     * @returns {Boolean}
     */
    function isFn(fn) {
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
     * Register an event, or add to an existing event
     * @param   {String}  name    Name of the event like: 'loaded'
     * @param   {Function}  fn    The closure to execute when signaled.
     * @return  {Mixed}           Unique ID for listener or false on incorrect parameters
     */

    this.on = function on() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var fn = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1]; // Make sure the fn is a function

      if (name && fn && isFn(fn)) {
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
    };
    /**
     * Register an event to fire only once
     * @param   {String}  name    Name of the event like: 'loaded'
     * @param   {Function}  fn    The closure to execute when signaled.
     * @return  {Mixed}           Unique ID for listener or false on incorrect parameters
     */


    this.once = function once() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var fn = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (name && fn && isFn(fn)) {
        var newId = 'cov_' + (callbackId + 1);

        var oneTimeFunc = function () {
          fn.apply(null, arguments);
          this.off(name, newId);
        }.bind(this);

        this.on(name, oneTimeFunc);
        return newId;
      }

      return false;
    };
    /**
     * Signal an event and run all of its subscribed functions.
     * @param  {String}    name  Name of the event like: 'loaded';
     * @param  {object[]}  args  Any arguments that need to be sent to the  fn
     * @return {object}          Current instance of Cov, to allow for chaining
     */


    this.signal = function signal() {
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
    };
    /**
     * Unregister (turn off) an event.
     * @param  {String}           Name of the event like: 'loaded';
     * @param  {String|Function}  ID of listener as returned by `on` function, or the original function
     * @return {object}           Current instance of Cov, to allow for chaining
     */


    this.off = function off() {
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
                // Remove based off ID or the reference of the function passed matches original
                if (cbObj.id === id || isFn(id) && cbObj.fn === id) {
                  callbacks.splice(ix, 1);
                }
              });
            }

            return;
          }
        });
      }

      return this;
    };
  }

  var cov = new Covenant();
  var cov_1 = {
    cov: cov,
    Covenant: Covenant
  };

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
    var publisher = new cov_1.Covenant();
    this.on = publisher.on;
    this.once = publisher.once;
    this.off = publisher.off;
    var resizeEvents = new ResizeEvents(publisher, this.options); // Pass resizeEvents object to scroll listener
    // in order to have access to window height, width

    var scrollEvents = new ScrollEvents(publisher, this.options, resizeEvents);
    var visibilityEvents = new VisibilityEvents(publisher, this.options);
    var loadEvents = new LoadEvents(publisher, this.options);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93ZXZlbnRzLmpzIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvY292anMvY292LmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL3Rocm90dGxlLmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL2RlYm91bmNlLmpzIiwic3JjL3Njcm9sbC5qcyIsInNyYy9yZXNpemUuanMiLCJzcmMvdmlzaWJpbGl0eS5qcyIsInNyYy9sb2FkLmpzIiwic3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBEYXZlIERldm9yIDxkYXZlZGV2b3JAZ21haWwuY29tPlxuICovXG5cbi8qKlxuICogQ29uc3R1Y3RvciB0byBjcmVhdGUgYW4gb2JqZWN0IHRvIGhvbGQgYWxsIG9mIHRoZSBhcHBzIGNvdmVuYW50cy5cbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gQ292ZW5hbnQoKSB7XG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYSB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuXHQgKlxuXHQgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICovXG5cdGZ1bmN0aW9uIGlzRm4oZm4pIHtcblx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZuKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9yZSBpbmNyZW1lbnRpbmcgSUQgZm9yIGVhY2ggcGFzc2VkIGNhbGxiYWNrXG5cdCAqIEB0eXBlICB7SW50fVxuXHQgKi9cblx0dmFyIGNhbGxiYWNrSWQgPSAwO1xuXG5cdC8qKlxuXHQgKiBTdG9yZSBhbGwgb2Ygb3VyIGNvdmVuYW50c1xuXHQgKiBAdHlwZSAge0FycmF5fVxuXHQgKi9cblx0dmFyIGNvdmVuYW50cyA9IFtdO1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBhbiBldmVudCwgb3IgYWRkIHRvIGFuIGV4aXN0aW5nIGV2ZW50XG5cdCAqIEBwYXJhbSAgIHtTdHJpbmd9ICBuYW1lICAgIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnXG5cdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuICAgIFRoZSBjbG9zdXJlIHRvIGV4ZWN1dGUgd2hlbiBzaWduYWxlZC5cblx0ICogQHJldHVybiAge01peGVkfSAgICAgICAgICAgVW5pcXVlIElEIGZvciBsaXN0ZW5lciBvciBmYWxzZSBvbiBpbmNvcnJlY3QgcGFyYW1ldGVyc1xuXHQgKi9cblx0dGhpcy5vbiA9IGZ1bmN0aW9uIG9uKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGZuID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhlIGZuIGlzIGEgZnVuY3Rpb25cblx0XHRpZiAobmFtZSAmJiBmbiAmJiBpc0ZuKGZuKSkge1xuXHRcdFx0dmFyIF9leGlzdHMgPSBmYWxzZTtcblx0XHRcdHZhciBjYk9iaiA9IHtcblx0XHRcdFx0aWQ6ICdjb3ZfJyArICgrK2NhbGxiYWNrSWQpLFxuXHRcdFx0XHRmbjogZm5cblx0XHRcdH1cblxuXHRcdFx0Ly8gY2hlY2sgaWYgdGhpcyBldmVuIGV4aXN0c1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdikge1xuXHRcdFx0XHQvLyBJZiBpdCBhbHJlYWR5IGV4aXN0cywgYWRkIHRoZSBmdW5jdGlvbiB0byBpdHMgZnVuY3Rpb25zLlxuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLnB1c2goY2JPYmopO1xuXHRcdFx0XHRcdF9leGlzdHMgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIElmIGl0IGRvZXNudCBleGlzdCBjcmVhdGUgaXQuXG5cdFx0XHRpZiAoIV9leGlzdHMpIHtcblx0XHRcdFx0dmFyIG5ld0NvdmVuYW50ID0ge1xuXHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0Y2FsbGJhY2tzOiBbY2JPYmpdXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Y292ZW5hbnRzLnB1c2gobmV3Q292ZW5hbnQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNiT2JqLmlkO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGFuIGV2ZW50IHRvIGZpcmUgb25seSBvbmNlXG5cdCAqIEBwYXJhbSAgIHtTdHJpbmd9ICBuYW1lICAgIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnXG5cdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuICAgIFRoZSBjbG9zdXJlIHRvIGV4ZWN1dGUgd2hlbiBzaWduYWxlZC5cblx0ICogQHJldHVybiAge01peGVkfSAgICAgICAgICAgVW5pcXVlIElEIGZvciBsaXN0ZW5lciBvciBmYWxzZSBvbiBpbmNvcnJlY3QgcGFyYW1ldGVyc1xuXHQgKi9cblx0dGhpcy5vbmNlID0gZnVuY3Rpb24gb25jZSgpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBmbiA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0aWYgKG5hbWUgJiYgZm4gJiYgaXNGbihmbikpIHtcblx0XHRcdHZhciBuZXdJZCA9ICdjb3ZfJyArIChjYWxsYmFja0lkICsgMSk7XG5cdFx0XHR2YXIgb25lVGltZUZ1bmMgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Zm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0XHRcdFx0dGhpcy5vZmYobmFtZSwgbmV3SWQpO1xuXHRcdFx0fS5iaW5kKHRoaXMpO1xuXG5cdFx0XHR0aGlzLm9uKG5hbWUsIG9uZVRpbWVGdW5jKTtcblxuXHRcdFx0cmV0dXJuIG5ld0lkO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvKipcblx0ICogU2lnbmFsIGFuIGV2ZW50IGFuZCBydW4gYWxsIG9mIGl0cyBzdWJzY3JpYmVkIGZ1bmN0aW9ucy5cblx0ICogQHBhcmFtICB7U3RyaW5nfSAgICBuYW1lICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJztcblx0ICogQHBhcmFtICB7b2JqZWN0W119ICBhcmdzICBBbnkgYXJndW1lbnRzIHRoYXQgbmVlZCB0byBiZSBzZW50IHRvIHRoZSAgZm5cblx0ICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICBDdXJyZW50IGluc3RhbmNlIG9mIENvdiwgdG8gYWxsb3cgZm9yIGNoYWluaW5nXG5cdCAqL1xuXHR0aGlzLnNpZ25hbCA9IGZ1bmN0aW9uIHNpZ25hbCgpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMV07XG5cblx0XHRpZiAobmFtZSkge1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdikge1xuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblxuXHRcdFx0XHRcdGNvdi5jYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2JPYmopIHtcblx0XHRcdFx0XHRcdGNiT2JqLmZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcblx0ICogVW5yZWdpc3RlciAodHVybiBvZmYpIGFuIGV2ZW50LlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJztcblx0ICogQHBhcmFtICB7U3RyaW5nfEZ1bmN0aW9ufSAgSUQgb2YgbGlzdGVuZXIgYXMgcmV0dXJuZWQgYnkgYG9uYCBmdW5jdGlvbiwgb3IgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgIEN1cnJlbnQgaW5zdGFuY2Ugb2YgQ292LCB0byBhbGxvdyBmb3IgY2hhaW5pbmdcblx0ICovXG5cdHRoaXMub2ZmID0gZnVuY3Rpb24gb2ZmKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGlkID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHRpZiAobmFtZSkge1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdiwgaW5kZXgsIGFycikge1xuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblx0XHRcdFx0XHQvLyBJZiBubyBJRCBpcyBwYXNzZWQsIHJlbW92ZSBhbGwgbGlzdGVuZXJzXG5cdFx0XHRcdFx0aWYgKCFpZCkge1xuXHRcdFx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSBqdXN0IHJlbW92ZSBzcGVjaWZpZWQgY2FsbGJhY2tcblx0XHRcdFx0XHRcdGNvdi5jYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2JPYmosIGl4LCBjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIGJhc2VkIG9mZiBJRCBvciB0aGUgcmVmZXJlbmNlIG9mIHRoZSBmdW5jdGlvbiBwYXNzZWQgbWF0Y2hlcyBvcmlnaW5hbFxuXHRcdFx0XHRcdFx0XHRpZiAoY2JPYmouaWQgPT09IGlkIHx8IChpc0ZuKGlkKSAmJiBjYk9iai5mbiA9PT0gaWQpKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnNwbGljZShpeCwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xufVxuXG52YXIgY292ID0gbmV3IENvdmVuYW50KCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjb3Y6IGNvdixcblx0Q292ZW5hbnQ6IENvdmVuYW50XG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWZpbmVkLG5vLXBhcmFtLXJlYXNzaWduLG5vLXNoYWRvdyAqL1xuXG4vKipcbiAqIFRocm90dGxlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgcmF0ZSBsaW1pdGluZ1xuICogZXhlY3V0aW9uIG9mIGhhbmRsZXJzIG9uIGV2ZW50cyBsaWtlIHJlc2l6ZSBhbmQgc2Nyb2xsLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gICAgZGVsYXkgICAgICAgICAgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnQgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgIFtub1RyYWlsaW5nXSAgIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgbm9UcmFpbGluZyBpcyB0cnVlLCBjYWxsYmFjayB3aWxsIG9ubHkgZXhlY3V0ZSBldmVyeSBgZGVsYXlgIG1pbGxpc2Vjb25kcyB3aGlsZSB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZC4gSWYgbm9UcmFpbGluZyBpcyBmYWxzZSBvciB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmUgZmluYWwgdGltZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlciB0aGUgbGFzdCB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICogQHBhcmFtICB7RnVuY3Rpb259ICBjYWxsYmFjayAgICAgICBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy4gVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGBjYWxsYmFja2Agd2hlbiB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gICBbZGVib3VuY2VNb2RlXSBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLiBJZiBgZGVib3VuY2VNb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259ICBBIG5ldywgdGhyb3R0bGVkLCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIGRlbGF5LCBub1RyYWlsaW5nLCBjYWxsYmFjaywgZGVib3VuY2VNb2RlICkge1xuXG5cdC8vIEFmdGVyIHdyYXBwZXIgaGFzIHN0b3BwZWQgYmVpbmcgY2FsbGVkLCB0aGlzIHRpbWVvdXQgZW5zdXJlcyB0aGF0XG5cdC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxuXHQvLyBkZWJvdW5jZSBtb2Rlcy5cblx0dmFyIHRpbWVvdXRJRDtcblxuXHQvLyBLZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHRpbWUgYGNhbGxiYWNrYCB3YXMgZXhlY3V0ZWQuXG5cdHZhciBsYXN0RXhlYyA9IDA7XG5cblx0Ly8gYG5vVHJhaWxpbmdgIGRlZmF1bHRzIHRvIGZhbHN5LlxuXHRpZiAoIHR5cGVvZiBub1RyYWlsaW5nICE9PSAnYm9vbGVhbicgKSB7XG5cdFx0ZGVib3VuY2VNb2RlID0gY2FsbGJhY2s7XG5cdFx0Y2FsbGJhY2sgPSBub1RyYWlsaW5nO1xuXHRcdG5vVHJhaWxpbmcgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyBUaGUgYHdyYXBwZXJgIGZ1bmN0aW9uIGVuY2Fwc3VsYXRlcyBhbGwgb2YgdGhlIHRocm90dGxpbmcgLyBkZWJvdW5jaW5nXG5cdC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXG5cdC8vIGlzIGV4ZWN1dGVkLlxuXHRmdW5jdGlvbiB3cmFwcGVyICgpIHtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgZWxhcHNlZCA9IE51bWJlcihuZXcgRGF0ZSgpKSAtIGxhc3RFeGVjO1xuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG5cdFx0Ly8gRXhlY3V0ZSBgY2FsbGJhY2tgIGFuZCB1cGRhdGUgdGhlIGBsYXN0RXhlY2AgdGltZXN0YW1wLlxuXHRcdGZ1bmN0aW9uIGV4ZWMgKCkge1xuXHRcdFx0bGFzdEV4ZWMgPSBOdW1iZXIobmV3IERhdGUoKSk7XG5cdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbikgdGhpcyBpcyB1c2VkIHRvIGNsZWFyIHRoZSBmbGFnXG5cdFx0Ly8gdG8gYWxsb3cgZnV0dXJlIGBjYWxsYmFja2AgZXhlY3V0aW9ucy5cblx0XHRmdW5jdGlvbiBjbGVhciAoKSB7XG5cdFx0XHR0aW1lb3V0SUQgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBkZWJvdW5jZU1vZGUgJiYgIXRpbWVvdXRJRCApIHtcblx0XHRcdC8vIFNpbmNlIGB3cmFwcGVyYCBpcyBiZWluZyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGFuZFxuXHRcdFx0Ly8gYGRlYm91bmNlTW9kZWAgaXMgdHJ1ZSAoYXQgYmVnaW4pLCBleGVjdXRlIGBjYWxsYmFja2AuXG5cdFx0XHRleGVjKCk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuXG5cdFx0aWYgKCB0aW1lb3V0SUQgKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dElEKTtcblx0XHR9XG5cblx0XHRpZiAoIGRlYm91bmNlTW9kZSA9PT0gdW5kZWZpbmVkICYmIGVsYXBzZWQgPiBkZWxheSApIHtcblx0XHRcdC8vIEluIHRocm90dGxlIG1vZGUsIGlmIGBkZWxheWAgdGltZSBoYXMgYmVlbiBleGNlZWRlZCwgZXhlY3V0ZVxuXHRcdFx0Ly8gYGNhbGxiYWNrYC5cblx0XHRcdGV4ZWMoKTtcblxuXHRcdH0gZWxzZSBpZiAoIG5vVHJhaWxpbmcgIT09IHRydWUgKSB7XG5cdFx0XHQvLyBJbiB0cmFpbGluZyB0aHJvdHRsZSBtb2RlLCBzaW5jZSBgZGVsYXlgIHRpbWUgaGFzIG5vdCBiZWVuXG5cdFx0XHQvLyBleGNlZWRlZCwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGBkZWxheWAgbXMgYWZ0ZXIgbW9zdFxuXHRcdFx0Ly8gcmVjZW50IGV4ZWN1dGlvbi5cblx0XHRcdC8vXG5cdFx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZVxuXHRcdFx0Ly8gYWZ0ZXIgYGRlbGF5YCBtcy5cblx0XHRcdC8vXG5cdFx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0b1xuXHRcdFx0Ly8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLlxuXHRcdFx0dGltZW91dElEID0gc2V0VGltZW91dChkZWJvdW5jZU1vZGUgPyBjbGVhciA6IGV4ZWMsIGRlYm91bmNlTW9kZSA9PT0gdW5kZWZpbmVkID8gZGVsYXkgLSBlbGFwc2VkIDogZGVsYXkpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuXHRyZXR1cm4gd3JhcHBlcjtcblxufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmaW5lZCAqL1xuXG52YXIgdGhyb3R0bGUgPSByZXF1aXJlKCcuL3Rocm90dGxlJyk7XG5cbi8qKlxuICogRGVib3VuY2UgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIERlYm91bmNpbmcsIHVubGlrZSB0aHJvdHRsaW5nLFxuICogZ3VhcmFudGVlcyB0aGF0IGEgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBhIHNpbmdsZSB0aW1lLCBlaXRoZXIgYXQgdGhlXG4gKiB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNlcmllcyBvZiBjYWxscywgb3IgYXQgdGhlIHZlcnkgZW5kLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gICBkZWxheSAgICAgICAgIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50IGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gIFthdEJlZ2luXSAgICAgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBhdEJlZ2luIGlzIGZhbHNlIG9yIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYGRlbGF5YCBtaWxsaXNlY29uZHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyIHRoZSBsYXN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiBJZiBhdEJlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25seSBhdCB0aGUgZmlyc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpLlxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrICAgICAgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBkZWxheSwgYXRCZWdpbiwgY2FsbGJhY2sgKSB7XG5cdHJldHVybiBjYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gdGhyb3R0bGUoZGVsYXksIGF0QmVnaW4sIGZhbHNlKSA6IHRocm90dGxlKGRlbGF5LCBjYWxsYmFjaywgYXRCZWdpbiAhPT0gZmFsc2UpO1xufTtcbiIsImNsYXNzIFNjcm9sbEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMsIHNpemVSZWYpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy53aW5kb3dTaXplID0gc2l6ZVJlZlxuICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IG51bGxcblxuICAgIHRoaXMuZGVib3VuY2VkTGlzdGVuZXIgPSB0aGlzLmRlYm91bmNlZExpc3RlbmVyLmJpbmQodGhpcylcbiAgICB0aGlzLnRocm90dGxlZExpc3RlbmVyID0gdGhpcy50aHJvdHRsZWRMaXN0ZW5lci5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlKClcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICgpIHtcbiAgICB0aGlzLnNjcm9sbFRvcCA9IHRoaXMubGFzdFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgIHRoaXMuc2Nyb2xsUGVyY2VudCA9XG4gICAgICAgICh0aGlzLnNjcm9sbFRvcCAvICh0aGlzLndpbmRvd1NpemUuc2Nyb2xsSGVpZ2h0IC0gdGhpcy53aW5kb3dTaXplLmhlaWdodCkpICogMTAwXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnRcbiAgICB9XG4gIH1cblxuICBkZWJvdW5jZWRMaXN0ZW5lciAoKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICB0aGlzLnNjcm9sbFBlcmNlbnQgPVxuICAgICAgICAodGhpcy5zY3JvbGxUb3AgLyAodGhpcy53aW5kb3dTaXplLnNjcm9sbEhlaWdodCAtIHRoaXMud2luZG93U2l6ZS5oZWlnaHQpKSAqIDEwMFxuXG4gICAgdGhpcy5zaWduYWwoJ3Njcm9sbC5zdGFydCcsIFt7XG4gICAgICBzY3JvbGxUb3A6IHRoaXMuc2Nyb2xsVG9wLFxuICAgICAgc2Nyb2xsUGVyY2VudDogdGhpcy5zY3JvbGxQZXJjZW50XG4gICAgfV0pXG5cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbFRvcFxuICB9XG5cbiAgdGhyb3R0bGVkTGlzdGVuZXIgKCkge1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgdGhpcy5zY3JvbGxQZXJjZW50ID1cbiAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIC8gKHRoaXMud2luZG93U2l6ZS5zY3JvbGxIZWlnaHQgLSB0aGlzLndpbmRvd1NpemUuaGVpZ2h0KSkgKiAxMDBcblxuICAgIGNvbnN0IHNjcm9sbE9iaiA9IHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnRcbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsJywgW3Njcm9sbE9ial0pXG5cbiAgICBpZiAodGhpcy5zY3JvbGxUb3AgPiB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwuZG93bicsIFtzY3JvbGxPYmpdKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zY3JvbGxUb3AgPCB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwudXAnLCBbc2Nyb2xsT2JqXSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxUb3AgPD0gMCkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Njcm9sbC50b3AnLCBbc2Nyb2xsT2JqXSlcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsT2JqLnNjcm9sbFBlcmNlbnQgPj0gMTAwKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLmJvdHRvbScsIFtzY3JvbGxPYmpdKVxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpXG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLnN0b3AnLCBbc2Nyb2xsT2JqXSlcbiAgICB9LCB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXkgKyAxKVxuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3BcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JvbGxFdmVudHNcbiIsImNsYXNzIFJlc2l6ZUV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gbnVsbFxuXG4gICAgdGhpcy5kZWJvdW5jZWRMaXN0ZW5lciA9IHRoaXMuZGVib3VuY2VkTGlzdGVuZXIuYmluZCh0aGlzKVxuICAgIHRoaXMudGhyb3R0bGVkTGlzdGVuZXIgPSB0aGlzLnRocm90dGxlZExpc3RlbmVyLmJpbmQodGhpcylcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5sYXN0SCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIHRoaXMud2lkdGggPSB0aGlzLmxhc3RXID0gd2luZG93LmlubmVyV2lkdGhcbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRoaXMubGFzdFMgPSBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodFxuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLmxhc3RPID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvblxuICAgIH1cbiAgfVxuXG4gIGRlYm91bmNlZExpc3RlbmVyICgpIHtcbiAgICB0aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHRcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnXG5cbiAgICBjb25zdCBzaXplT2JqID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgc2Nyb2xsSGVpZ2h0OiB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uXG4gICAgfVxuXG4gICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zdGFydCcsIFtzaXplT2JqXSlcblxuICAgIHRoaXMubGFzdEggPSB0aGlzLmhlaWdodFxuICAgIHRoaXMubGFzdFcgPSB0aGlzLndpZHRoXG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0XG4gIH1cblxuICB0aHJvdHRsZWRMaXN0ZW5lciAoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMuaGVpZ2h0ID4gdGhpcy53aWR0aCA/ICdwb3J0cmFpdCcgOiAnbGFuZHNjYXBlJ1xuXG4gICAgY29uc3Qgc2l6ZU9iaiA9IHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvblxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsKCdyZXNpemUnLCBbc2l6ZU9ial0pXG5cbiAgICBpZiAodGhpcy5vcmllbnRhdGlvbiAhPT0gdGhpcy5sYXN0Tykge1xuICAgICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5vcmllbnRhdGlvbkNoYW5nZScsIFtzaXplT2JqXSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT09IHRoaXMubGFzdFMpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdyZXNpemUuc2Nyb2xsSGVpZ2h0Q2hhbmdlJywgW3NpemVPYmpdKVxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpXG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNpZ25hbCgncmVzaXplLnN0b3AnLCBbc2l6ZU9ial0pXG4gICAgfSwgdGhpcy5vcHRpb25zLnJlc2l6ZURlbGF5ICsgMSlcblxuICAgIHRoaXMubGFzdEggPSB0aGlzLmhlaWdodFxuICAgIHRoaXMubGFzdFcgPSB0aGlzLndpZHRoXG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0XG4gICAgdGhpcy5sYXN0TyA9IHRoaXMub3JpZW50YXRpb25cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNpemVFdmVudHNcbiIsImNsYXNzIFZpc2liaWxpdHlFdmVudHMge1xuICBjb25zdHJ1Y3RvciAocHVibGlzaGVyLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zaWduYWwgPSBwdWJsaXNoZXIuc2lnbmFsXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5jaGFuZ2VMaXN0ZW50ZXIgPSB0aGlzLmNoYW5nZUxpc3RlbnRlci5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlKClcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICgpIHtcbiAgICB0aGlzLnZpc2libGUgPSAhZG9jdW1lbnQuaGlkZGVuXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc2libGU6IHRoaXMudmlzaWJsZVxuICAgIH1cbiAgfVxuXG4gIGNoYW5nZUxpc3RlbnRlciAoKSB7XG4gICAgdGhpcy52aXNpYmxlID0gIWRvY3VtZW50LmhpZGRlblxuXG4gICAgY29uc3QgdmlzaWJsZU9iaiA9IHtcbiAgICAgIHZpc2libGU6IHRoaXMudmlzaWJsZVxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsKCd2aXNpYmlsaXR5Q2hhbmdlJywgW3Zpc2libGVPYmpdKVxuXG4gICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2Uuc2hvdycsIFt2aXNpYmxlT2JqXSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2UuaGlkZScsIFt2aXNpYmxlT2JqXSlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlzaWJpbGl0eUV2ZW50c1xuIiwiY2xhc3MgTG9hZEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICB0aGlzLmNoYW5nZUxpc3RlbnRlciA9IHRoaXMuY2hhbmdlTGlzdGVudGVyLmJpbmQodGhpcylcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKCkge1xuICAgIHRoaXMubG9hZGVkID0gZG9jdW1lbnQucmVhZHlTdGF0ZVxuICB9XG5cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2FkZWQ6IHRoaXMubG9hZGVkXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlTGlzdGVudGVyICgpIHtcbiAgICB0aGlzLmxvYWRlZCA9IGRvY3VtZW50LnJlYWR5U3RhdGVcblxuICAgIGNvbnN0IGxvYWRlZE9iaiA9IHtcbiAgICAgIGxvYWRlZDogdGhpcy5sb2FkZWRcbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbCgnbG9hZCcsIFtsb2FkZWRPYmpdKVxuXG4gICAgaWYgKHRoaXMubG9hZGVkID09PSAnaW50ZXJhY3RpdmUnKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnbG9hZC5pbnRlcmFjdGl2ZScsIFtsb2FkZWRPYmpdKVxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2FkZWQgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdsb2FkLmNvbXBsZXRlJywgW2xvYWRlZE9ial0pXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRFdmVudHNcbiIsIi8qIVxuICogV2luZG93RXZlbnRzLmpzXG4gKiBAYXV0aG9yIFBldGUgRHJvbGwgPGRyb2xsLnBAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmltcG9ydCB7IENvdmVuYW50IH0gZnJvbSAnY292anMnXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvZGVib3VuY2UnXG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvdGhyb3R0bGUnXG5pbXBvcnQgU2Nyb2xsRXZlbnRzIGZyb20gJy4vc2Nyb2xsJ1xuaW1wb3J0IFJlc2l6ZUV2ZW50cyBmcm9tICcuL3Jlc2l6ZSdcbmltcG9ydCBWaXNpYmlsaXR5RXZlbnRzIGZyb20gJy4vdmlzaWJpbGl0eSdcbmltcG9ydCBMb2FkRXZlbnRzIGZyb20gJy4vbG9hZCdcblxuY2xhc3MgV2luZG93RXZlbnRzIHtcbiAgY29uc3RydWN0b3IgKG9wdHMpIHtcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIHNjcm9sbERlbGF5OiAxMDAsXG4gICAgICByZXNpemVEZWxheTogMzUwXG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0cyA/IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdHMgfSA6IGRlZmF1bHRPcHRpb25zXG5cbiAgICBjb25zdCBwdWJsaXNoZXIgPSBuZXcgQ292ZW5hbnQoKVxuICAgIHRoaXMub24gPSBwdWJsaXNoZXIub25cbiAgICB0aGlzLm9uY2UgPSBwdWJsaXNoZXIub25jZVxuICAgIHRoaXMub2ZmID0gcHVibGlzaGVyLm9mZlxuXG4gICAgY29uc3QgcmVzaXplRXZlbnRzID0gbmV3IFJlc2l6ZUV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucylcbiAgICAvLyBQYXNzIHJlc2l6ZUV2ZW50cyBvYmplY3QgdG8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgLy8gaW4gb3JkZXIgdG8gaGF2ZSBhY2Nlc3MgdG8gd2luZG93IGhlaWdodCwgd2lkdGhcbiAgICBjb25zdCBzY3JvbGxFdmVudHMgPSBuZXcgU2Nyb2xsRXZlbnRzKHB1Ymxpc2hlciwgdGhpcy5vcHRpb25zLCByZXNpemVFdmVudHMpXG4gICAgY29uc3QgdmlzaWJpbGl0eUV2ZW50cyA9IG5ldyBWaXNpYmlsaXR5RXZlbnRzKHB1Ymxpc2hlciwgdGhpcy5vcHRpb25zKVxuICAgIGNvbnN0IGxvYWRFdmVudHMgPSBuZXcgTG9hZEV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucylcblxuICAgIHRoaXMuZ2V0U3RhdGUgPSAoKSA9PiAoe1xuICAgICAgLi4ucmVzaXplRXZlbnRzLmdldFN0YXRlKCksXG4gICAgICAuLi5zY3JvbGxFdmVudHMuZ2V0U3RhdGUoKSxcbiAgICAgIC4uLnZpc2liaWxpdHlFdmVudHMuZ2V0U3RhdGUoKSxcbiAgICAgIC4uLmxvYWRFdmVudHMuZ2V0U3RhdGUoKVxuICAgIH0pXG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlID0gKCkgPT4ge1xuICAgICAgcmVzaXplRXZlbnRzLnVwZGF0ZVN0YXRlKClcbiAgICAgIHNjcm9sbEV2ZW50cy51cGRhdGVTdGF0ZSgpXG4gICAgICB2aXNpYmlsaXR5RXZlbnRzLnVwZGF0ZVN0YXRlKClcbiAgICAgIGxvYWRFdmVudHMudXBkYXRlU3RhdGUoKVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKVxuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXksXG4gICAgICAvLyBBdCBiZWdpbm5pbmdcbiAgICAgIHRydWUsXG4gICAgICAvLyBEZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgIHNjcm9sbEV2ZW50cy5kZWJvdW5jZWRMaXN0ZW5lclxuICAgICksIGZhbHNlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aHJvdHRsZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXksXG4gICAgICAvLyBObyBUcmFpbGluZy4gSWYgZmFsc2UsIHdpbGwgZ2V0IGNhbGxlZCBvbmUgbGFzdCB0aW1lIGFmdGVyIHRoZSBsYXN0IHRocm90dGxlZCBjYWxsXG4gICAgICBmYWxzZSxcbiAgICAgIC8vIFRocm90dGxlZCBmdW5jdGlvblxuICAgICAgc2Nyb2xsRXZlbnRzLnRocm90dGxlZExpc3RlbmVyXG4gICAgKSwgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGRlYm91bmNlKFxuICAgICAgLy8gRGVsYXlcbiAgICAgIHRoaXMub3B0aW9ucy5yZXNpemVEZWxheSxcbiAgICAgIC8vIEF0IGJlZ2lubmluZ1xuICAgICAgdHJ1ZSxcbiAgICAgIC8vIERlYm91bmNlZCBmdW5jdGlvblxuICAgICAgcmVzaXplRXZlbnRzLmRlYm91bmNlZExpc3RlbmVyXG4gICAgKSwgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRocm90dGxlKFxuICAgICAgLy8gRGVsYXlcbiAgICAgIHRoaXMub3B0aW9ucy5yZXNpemVEZWxheSxcbiAgICAgIC8vIE5vIFRyYWlsaW5nLiBJZiBmYWxzZSwgd2lsbCBnZXQgY2FsbGVkIG9uZSBsYXN0IHRpbWUgYWZ0ZXIgdGhlIGxhc3QgdGhyb3R0bGVkIGNhbGxcbiAgICAgIGZhbHNlLFxuICAgICAgLy8gVGhyb3R0bGVkIGZ1bmN0aW9uXG4gICAgICByZXNpemVFdmVudHMudGhyb3R0bGVkTGlzdGVuZXJcbiAgICApLCBmYWxzZSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgdmlzaWJpbGl0eUV2ZW50cy5jaGFuZ2VMaXN0ZW50ZXIsIGZhbHNlKVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgb25jZSBhbGxcbiAgICAgIC8vIGltYWdlcyBhbmQgcmVzb3VyY2VzIGhhdmUgbG9hZGVkXG4gICAgICB0aGlzLnVwZGF0ZVN0YXRlKClcbiAgICAgIGxvYWRFdmVudHMuY2hhbmdlTGlzdGVudGVyKClcbiAgICB9LCBmYWxzZSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXaW5kb3dFdmVudHNcbiJdLCJuYW1lcyI6WyJDb3ZlbmFudCIsImlzRm4iLCJmbiIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImNhbGxiYWNrSWQiLCJjb3ZlbmFudHMiLCJvbiIsIm5hbWUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJfZXhpc3RzIiwiY2JPYmoiLCJpZCIsImZvckVhY2giLCJjb3YiLCJjYWxsYmFja3MiLCJwdXNoIiwibmV3Q292ZW5hbnQiLCJvbmNlIiwibmV3SWQiLCJvbmVUaW1lRnVuYyIsImFwcGx5Iiwib2ZmIiwiYmluZCIsInNpZ25hbCIsImFyZ3MiLCJpbmRleCIsImFyciIsInNwbGljZSIsIml4IiwiZGVsYXkiLCJub1RyYWlsaW5nIiwiY2FsbGJhY2siLCJkZWJvdW5jZU1vZGUiLCJ0aW1lb3V0SUQiLCJsYXN0RXhlYyIsIndyYXBwZXIiLCJzZWxmIiwiZWxhcHNlZCIsIk51bWJlciIsIkRhdGUiLCJleGVjIiwiY2xlYXIiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiYXRCZWdpbiIsInRocm90dGxlIiwiU2Nyb2xsRXZlbnRzIiwicHVibGlzaGVyIiwib3B0aW9ucyIsInNpemVSZWYiLCJ3aW5kb3dTaXplIiwic2Nyb2xsVGltZW91dCIsImRlYm91bmNlZExpc3RlbmVyIiwidGhyb3R0bGVkTGlzdGVuZXIiLCJ1cGRhdGVTdGF0ZSIsInNjcm9sbFRvcCIsImxhc3RTY3JvbGxUb3AiLCJ3aW5kb3ciLCJzY3JvbGxZIiwicGFnZVlPZmZzZXQiLCJzY3JvbGxQZXJjZW50Iiwic2Nyb2xsSGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsT2JqIiwic2Nyb2xsRGVsYXkiLCJSZXNpemVFdmVudHMiLCJyZXNpemVUaW1lb3V0IiwibGFzdEgiLCJpbm5lckhlaWdodCIsIndpZHRoIiwibGFzdFciLCJpbm5lcldpZHRoIiwibGFzdFMiLCJkb2N1bWVudCIsImJvZHkiLCJvcmllbnRhdGlvbiIsImxhc3RPIiwic2l6ZU9iaiIsInJlc2l6ZURlbGF5IiwiVmlzaWJpbGl0eUV2ZW50cyIsImNoYW5nZUxpc3RlbnRlciIsInZpc2libGUiLCJoaWRkZW4iLCJ2aXNpYmxlT2JqIiwiTG9hZEV2ZW50cyIsImxvYWRlZCIsInJlYWR5U3RhdGUiLCJsb2FkZWRPYmoiLCJXaW5kb3dFdmVudHMiLCJvcHRzIiwiZGVmYXVsdE9wdGlvbnMiLCJyZXNpemVFdmVudHMiLCJzY3JvbGxFdmVudHMiLCJ2aXNpYmlsaXR5RXZlbnRzIiwibG9hZEV2ZW50cyIsImdldFN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRlYm91bmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFJQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVNBLFFBQVQsR0FBb0I7O0VBRXBCO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQyxXQUFTQyxJQUFULENBQWNDLEVBQWQsRUFBa0I7RUFDakIsV0FBT0MsTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JKLEVBQS9CLE1BQXVDLG1CQUE5QztFQUNBOztFQUdGO0VBQ0E7RUFDQTs7O0VBQ0MsTUFBSUssVUFBVSxHQUFHLENBQWpCOztFQUdEO0VBQ0E7RUFDQTs7RUFDQyxNQUFJQyxTQUFTLEdBQUcsRUFBaEI7O0VBR0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQyxPQUFLQyxFQUFMLEdBQVUsU0FBU0EsRUFBVCxHQUFjO0VBQ3ZCLFFBQUlDLElBQUksR0FBR0MsU0FBUyxDQUFDQyxNQUFWLElBQW9CLENBQXBCLElBQXlCRCxTQUFTLENBQUMsQ0FBRCxDQUFULEtBQWlCRSxTQUExQyxHQUFzRCxLQUF0RCxHQUE4REYsU0FBUyxDQUFDLENBQUQsQ0FBbEY7RUFDQSxRQUFJVCxFQUFFLEdBQUdTLFNBQVMsQ0FBQ0MsTUFBVixJQUFvQixD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
