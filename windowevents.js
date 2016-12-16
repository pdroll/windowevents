(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WindowEvents = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
		var fn = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		// Make sure the fn is a function
		var isFn = _isFn(fn);

		if (name && fn && isFn) {
			var _exists = false;
			var cbObj = {
				id: 'cov_' + (++callbackId),
				fn: fn
			}

			// check if this even exists
			covenants.forEach(function (cov) {
				// If it already exists, add the function to its functions.
				if (cov.name === name) {
					cov.callbacks.push(cbObj);
					_exists = true;
					return;
				}
			});

			// If it doesnt exist create it.
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
		var oneTimeFunc = function() {
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
						cov.callbacks.forEach(function(cbObj, ix, callbacks) {
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

module.exports = Cov;

},{}],2:[function(require,module,exports){
/* eslint-disable no-undefined */

var throttle = require('./throttle');

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}  atBegin       Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @return {Function} A new, debounced function.
 */
module.exports = function ( delay, atBegin, callback ) {
	return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
};

},{"./throttle":3}],3:[function(require,module,exports){
/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}   noTrailing     Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset)
 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Boolean}   debounceMode   If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @return {Function}  A new, throttled, function.
 */
module.exports = function ( delay, noTrailing, callback, debounceMode ) {

	// After wrapper has stopped being called, this timeout ensures that
	// `callback` is executed at the proper times in `throttle` and `end`
	// debounce modes.
	var timeoutID;

	// Keep track of the last time `callback` was executed.
	var lastExec = 0;

	// `noTrailing` defaults to falsy.
	if ( typeof noTrailing !== 'boolean' ) {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
	}

	// The `wrapper` function encapsulates all of the throttling / debouncing
	// functionality and when executed will limit the rate at which `callback`
	// is executed.
	function wrapper () {

		var self = this;
		var elapsed = Number(new Date()) - lastExec;
		var args = arguments;

		// Execute `callback` and update the `lastExec` timestamp.
		function exec () {
			lastExec = Number(new Date());
			callback.apply(self, args);
		}

		// If `debounceMode` is true (at begin) this is used to clear the flag
		// to allow future `callback` executions.
		function clear () {
			timeoutID = undefined;
		}

		if ( debounceMode && !timeoutID ) {
			// Since `wrapper` is being called for the first time and
			// `debounceMode` is true (at begin), execute `callback`.
			exec();
		}

		// Clear any existing timeout.
		if ( timeoutID ) {
			clearTimeout(timeoutID);
		}

		if ( debounceMode === undefined && elapsed > delay ) {
			// In throttle mode, if `delay` time has been exceeded, execute
			// `callback`.
			exec();

		} else if ( noTrailing !== true ) {
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

	}

	// Return the wrapper function.
	return wrapper;

};

},{}],4:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _covjs = require('covjs');

var _covjs2 = _interopRequireDefault(_covjs);

var _debounce = require('throttle-debounce/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _throttle = require('throttle-debounce/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _scroll = require('./scroll');

var _scroll2 = _interopRequireDefault(_scroll);

var _resize = require('./resize');

var _resize2 = _interopRequireDefault(_resize);

var _visibility = require('./visibility');

var _visibility2 = _interopRequireDefault(_visibility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/*!
* WindowEvents.js
* @author Pete Droll <droll.p@gmail.com>
* @license MIT
*/


var WindowEvents = function WindowEvents(opts) {
  _classCallCheck(this, WindowEvents);

  var defaultOptions = {
    scrollDelay: 100,
    resizeDelay: 350
  };

  this.options = opts ? _extends({}, defaultOptions, opts) : defaultOptions;
  this.on = _covjs2.default.on;
  this.once = _covjs2.default.once;
  this.off = _covjs2.default.off;

  var resizeEvents = new _resize2.default(_covjs2.default, this.options);
  // Pass resizeEvents object to scroll listener
  // in order to have access to window height, width
  var scrollEvents = new _scroll2.default(_covjs2.default, this.options, resizeEvents);
  var visibilityEvents = new _visibility2.default(_covjs2.default, this.options);

  window.addEventListener('scroll', (0, _debounce2.default)(
  // Delay
  this.options.scrollDelay,
  // At beginning
  true,
  // Debounced function
  scrollEvents.debouncedListener));
  window.addEventListener('scroll', (0, _throttle2.default)(
  // Delay
  this.options.scrollDelay,
  // No Trailing. If false, will get called one last time after the last throttled call
  false,
  // Throttled function
  scrollEvents.throttledListener));
  window.addEventListener('resize', (0, _debounce2.default)(
  // Delay
  this.options.resizeDelay,
  // At beginning
  true,
  // Debounced function
  resizeEvents.debouncedListener));
  window.addEventListener('resize', (0, _throttle2.default)(
  // Delay
  this.options.resizeDelay,
  // No Trailing. If false, will get called one last time after the last throttled call
  false,
  // Throttled function
  resizeEvents.throttledListener));

  window.addEventListener('visibilitychange', visibilityEvents.changeListenter);

  this.getState = function () {
    return _extends({}, resizeEvents.getState(), scrollEvents.getState(), visibilityEvents.getState());
  };
};

module.exports = WindowEvents;

},{"./resize":5,"./scroll":6,"./visibility":7,"covjs":1,"throttle-debounce/debounce":2,"throttle-debounce/throttle":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResizeEvents = function () {
  function ResizeEvents(publisher, options) {
    _classCallCheck(this, ResizeEvents);

    this.signal = publisher.signal;
    this.options = options;
    this.height = this.lastH = window.innerHeight;
    this.width = this.lastW = window.innerWidth;
    this.scrollHeight = this.lastS = document.body.scrollHeight;
    this.orientation = this.lastO = this.height > this.width ? 'portrait' : 'landscape';
    this.resizeTimeout = null;

    this.debouncedListener = this.debouncedListener.bind(this);
    this.throttledListener = this.throttledListener.bind(this);
  }

  _createClass(ResizeEvents, [{
    key: 'getState',
    value: function getState() {
      return {
        height: this.height,
        width: this.width,
        scrollHeight: this.scrollHeight,
        orientation: this.orientation
      };
    }
  }, {
    key: 'debouncedListener',
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
    key: 'throttledListener',
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

exports.default = ResizeEvents;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScrollEvents = function () {
  function ScrollEvents(publisher, options, sizeRef) {
    _classCallCheck(this, ScrollEvents);

    this.signal = publisher.signal;
    this.options = options;
    this.scrollTop = this.lastScrollTop = window.scrollY || window.pageYOffset;
    this.windowSize = sizeRef;
    this.scrollTimeout = null;

    this.debouncedListener = this.debouncedListener.bind(this);
    this.throttledListener = this.throttledListener.bind(this);
  }

  _createClass(ScrollEvents, [{
    key: 'getState',
    value: function getState() {
      return {
        scrollTop: this.scrollTop,
        scrollPercent: this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height) * 100
      };
    }
  }, {
    key: 'debouncedListener',
    value: function debouncedListener() {
      this.scrollTop = window.scrollY || window.pageYOffset;
      this.signal('scroll.start', [{
        scrollTop: this.scrollTop,
        scrollPercent: this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height) * 100
      }]);

      this.lastScrollTop = this.scrollTop;
    }
  }, {
    key: 'throttledListener',
    value: function throttledListener() {
      var _this = this;

      this.scrollTop = window.scrollY || window.pageYOffset;

      var scrollObj = {
        scrollTop: this.scrollTop,
        scrollPercent: this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height) * 100
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

exports.default = ScrollEvents;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VisibilityEvents = function () {
  function VisibilityEvents(publisher, options) {
    _classCallCheck(this, VisibilityEvents);

    this.signal = publisher.signal;
    this.options = options;

    this.visible = !document.hidden;

    this.changeListenter = this.changeListenter.bind(this);
  }

  _createClass(VisibilityEvents, [{
    key: 'getState',
    value: function getState() {
      return {
        visible: this.visible
      };
    }
  }, {
    key: 'changeListenter',
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

exports.default = VisibilityEvents;

},{}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY292anMvY292LmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL3Rocm90dGxlLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3Jlc2l6ZS5qcyIsInNyYy9zY3JvbGwuanMiLCJzcmMvdmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3JGQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7QUFWQzs7Ozs7OztJQVlLLFksR0FFSixzQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLE1BQU0saUJBQWlCO0FBQ3JCLGlCQUFhLEdBRFE7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NEJBQVksU0FBWixFQUF1QixPQUF2QixFQUFnQztBQUFBOztBQUM5QixTQUFLLE1BQUwsR0FBYyxVQUFVLE1BQXhCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBZjs7QUFFQSxTQUFLLE9BQUwsR0FBZSxDQUFDLFNBQVMsTUFBekI7O0FBRUEsU0FBSyxlQUFMLEdBQXVCLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUF2QjtBQUNEOzs7OytCQUVVO0FBQ1QsYUFBTztBQUNMLGlCQUFTLEtBQUs7QUFEVCxPQUFQO0FBR0Q7OztzQ0FFaUI7QUFDaEIsV0FBSyxPQUFMLEdBQWUsQ0FBQyxTQUFTLE1BQXpCOztBQUVBLFVBQU0sYUFBYTtBQUNqQixpQkFBUyxLQUFLO0FBREcsT0FBbkI7O0FBSUEsV0FBSyxNQUFMLENBQVksa0JBQVosRUFBZ0MsQ0FBQyxVQUFELENBQWhDOztBQUVBLFVBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2hCLGFBQUssTUFBTCxDQUFZLHVCQUFaLEVBQXFDLENBQUMsVUFBRCxDQUFyQztBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssTUFBTCxDQUFZLHVCQUFaLEVBQXFDLENBQUMsVUFBRCxDQUFyQztBQUNEO0FBQ0Y7Ozs7OztrQkFHWSxnQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEBhdXRob3IgRGF2ZSBEZXZvciA8ZGF2ZWRldm9yQGdtYWlsLmNvbT5cbiAqL1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIHZhcmlhYmxlIGlzIGEgZnVuY3Rpb25cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICpcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBfaXNGbihmbikge1xuXHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZuKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBTdG9yZSBpbmNyZW1lbnRpbmcgSUQgZm9yIGVhY2ggcGFzc2VkIGNhbGxiYWNrXG4gKiBAdHlwZSAge0ludH1cbiAqL1xudmFyIGNhbGxiYWNrSWQgPSAwO1xuXG4vKipcbiAqIFN0b3JlIGFsbCBvZiBvdXIgY292ZW5hbnRzXG4gKiBAdHlwZSAge0FycmF5fVxuICovXG52YXIgY292ZW5hbnRzID0gW107XG5cbi8qKlxuICogT25lIG9iamVjdCB0byBob2xkIGFsbCBvZiB0aGUgYXBwcyBjb3ZlbmFudHMuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgQ292ID0ge1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBhbiBldmVudCwgb3IgYWRkIHRvIGFuIGV4aXN0aW5nIGV2ZW50XG5cdCAqIEBwYXJhbSAgIHtTdHJpbmd9ICBuYW1lICAgIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnXG5cdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuICAgIFRoZSBjbG9zdXJlIHRvIGV4ZWN1dGUgd2hlbiBzaWduYWxlZC5cblx0ICogQHJldHVybiAge01peGVkfSAgICAgICAgICAgVW5pcXVlIElEIGZvciBsaXN0ZW5lciBvciBmYWxzZSBvbiBpbmNvcnJlY3QgcGFyYW1ldGVyc1xuXHQgKi9cblx0b246IGZ1bmN0aW9uIG9uKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGZuID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhlIGZuIGlzIGEgZnVuY3Rpb25cblx0XHR2YXIgaXNGbiA9IF9pc0ZuKGZuKTtcblxuXHRcdGlmIChuYW1lICYmIGZuICYmIGlzRm4pIHtcblx0XHRcdHZhciBfZXhpc3RzID0gZmFsc2U7XG5cdFx0XHR2YXIgY2JPYmogPSB7XG5cdFx0XHRcdGlkOiAnY292XycgKyAoKytjYWxsYmFja0lkKSxcblx0XHRcdFx0Zm46IGZuXG5cdFx0XHR9XG5cblx0XHRcdC8vIGNoZWNrIGlmIHRoaXMgZXZlbiBleGlzdHNcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YpIHtcblx0XHRcdFx0Ly8gSWYgaXQgYWxyZWFkeSBleGlzdHMsIGFkZCB0aGUgZnVuY3Rpb24gdG8gaXRzIGZ1bmN0aW9ucy5cblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0Y292LmNhbGxiYWNrcy5wdXNoKGNiT2JqKTtcblx0XHRcdFx0XHRfZXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBJZiBpdCBkb2VzbnQgZXhpc3QgY3JlYXRlIGl0LlxuXHRcdFx0aWYgKCFfZXhpc3RzKSB7XG5cdFx0XHRcdHZhciBuZXdDb3ZlbmFudCA9IHtcblx0XHRcdFx0XHRuYW1lOiBuYW1lLFxuXHRcdFx0XHRcdGNhbGxiYWNrczogW2NiT2JqXVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGNvdmVuYW50cy5wdXNoKG5ld0NvdmVuYW50KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjYk9iai5pZDtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGFuIGV2ZW50IHRvIGZpcmUgb25seSBvbmNlXG5cdCAqIEBwYXJhbSAgIHtTdHJpbmd9ICBuYW1lICAgIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnXG5cdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuICAgIFRoZSBjbG9zdXJlIHRvIGV4ZWN1dGUgd2hlbiBzaWduYWxlZC5cblx0ICogQHJldHVybiAge01peGVkfSAgICAgICAgICAgVW5pcXVlIElEIGZvciBsaXN0ZW5lciBvciBmYWxzZSBvbiBpbmNvcnJlY3QgcGFyYW1ldGVyc1xuXHQgKi9cblx0b25jZTogZnVuY3Rpb24gb25jZSgpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBmbiA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0dmFyIG5ld0lkID0gJ2Nvdl8nICsgKGNhbGxiYWNrSWQgKyAxKTtcblx0XHR2YXIgb25lVGltZUZ1bmMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cdFx0XHR0aGlzLm9mZihuYW1lLCBuZXdJZCk7XG5cdFx0fS5iaW5kKHRoaXMpO1xuXG5cdFx0dGhpcy5vbihuYW1lLCBvbmVUaW1lRnVuYyk7XG5cblx0XHRyZXR1cm4gbmV3SWQ7XG5cdH0sXG5cblxuXHQvKipcblx0ICogU2lnbmFsIGFuIGV2ZW50IGFuZCBydW4gYWxsIG9mIGl0cyBzdWJzY3JpYmVkIGZ1bmN0aW9ucy5cblx0ICogQHBhcmFtICB7U3RyaW5nfSAgICBuYW1lICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJztcblx0ICogQHBhcmFtICB7b2JqZWN0W119ICBhcmdzICBBbnkgYXJndW1lbnRzIHRoYXQgbmVlZCB0byBiZSBzZW50IHRvIHRoZSAgZm5cblx0ICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICBDdXJyZW50IGluc3RhbmNlIG9mIENvdiwgdG8gYWxsb3cgZm9yIGNoYWluaW5nXG5cdCAqL1xuXHRzaWduYWw6IGZ1bmN0aW9uIHNpZ25hbCgpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMV07XG5cblxuXHRcdGlmIChuYW1lKSB7XG5cdFx0XHRjb3ZlbmFudHMuZm9yRWFjaChmdW5jdGlvbiAoY292KSB7XG5cdFx0XHRcdGlmIChjb3YubmFtZSA9PT0gbmFtZSkge1xuXG5cdFx0XHRcdFx0Y292LmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYk9iaikge1xuXHRcdFx0XHRcdFx0Y2JPYmouZm4uYXBwbHkobnVsbCwgYXJncyk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIFVucmVnaXN0ZXIgKHR1cm4gb2ZmKSBhbiBldmVudC5cblx0ICogQHBhcmFtICB7U3RyaW5nfSAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCc7XG5cdCAqIEBwYXJhbSAge1N0cmluZ30gIElEIG9mIGxpc3RlbmVyIGFzIHJldHVybmVkIGJ5IGBvbmAgZnVuY3Rpb25cblx0ICogQHJldHVybiB7b2JqZWN0fSAgQ3VycmVudCBpbnN0YW5jZSBvZiBDb3YsIHRvIGFsbG93IGZvciBjaGFpbmluZ1xuXHQgKi9cblx0b2ZmOiBmdW5jdGlvbiBvZmYoKSB7XG5cdFx0dmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1swXTtcblx0XHR2YXIgaWQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdGlmIChuYW1lKSB7XG5cdFx0XHRjb3ZlbmFudHMuZm9yRWFjaChmdW5jdGlvbiAoY292LCBpbmRleCwgYXJyKSB7XG5cdFx0XHRcdGlmIChjb3YubmFtZSA9PT0gbmFtZSkge1xuXHRcdFx0XHRcdC8vIElmIG5vIElEIGlzIHBhc3NlZCwgcmVtb3ZlIGFsbCBsaXN0ZW5lcnNcblx0XHRcdFx0XHRpZiAoIWlkKSB7XG5cdFx0XHRcdFx0XHRhcnIuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSBqdXN0IHJlbW92ZSBzcGVjaWZpZWQgY2FsbGJhY2tcblx0XHRcdFx0XHRcdGNvdi5jYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYk9iaiwgaXgsIGNhbGxiYWNrcykge1xuXHRcdFx0XHRcdFx0XHRpZiAoY2JPYmouaWQgPT09IGlkKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnNwbGljZShpeCwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvdjtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmaW5lZCAqL1xuXG52YXIgdGhyb3R0bGUgPSByZXF1aXJlKCcuL3Rocm90dGxlJyk7XG5cbi8qKlxuICogRGVib3VuY2UgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIERlYm91bmNpbmcsIHVubGlrZSB0aHJvdHRsaW5nLFxuICogZ3VhcmFudGVlcyB0aGF0IGEgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBhIHNpbmdsZSB0aW1lLCBlaXRoZXIgYXQgdGhlXG4gKiB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNlcmllcyBvZiBjYWxscywgb3IgYXQgdGhlIHZlcnkgZW5kLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gICBkZWxheSAgICAgICAgIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50IGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gIGF0QmVnaW4gICAgICAgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBhdEJlZ2luIGlzIGZhbHNlIG9yIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYGRlbGF5YCBtaWxsaXNlY29uZHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyIHRoZSBsYXN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiBJZiBhdEJlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25seSBhdCB0aGUgZmlyc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpLlxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrICAgICAgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBkZWxheSwgYXRCZWdpbiwgY2FsbGJhY2sgKSB7XG5cdHJldHVybiBjYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gdGhyb3R0bGUoZGVsYXksIGF0QmVnaW4sIGZhbHNlKSA6IHRocm90dGxlKGRlbGF5LCBjYWxsYmFjaywgYXRCZWdpbiAhPT0gZmFsc2UpO1xufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmaW5lZCxuby1wYXJhbS1yZWFzc2lnbixuby1zaGFkb3cgKi9cblxuLyoqXG4gKiBUaHJvdHRsZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRXNwZWNpYWxseSB1c2VmdWwgZm9yIHJhdGUgbGltaXRpbmdcbiAqIGV4ZWN1dGlvbiBvZiBoYW5kbGVycyBvbiBldmVudHMgbGlrZSByZXNpemUgYW5kIHNjcm9sbC5cbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIGRlbGF5ICAgICAgICAgIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50IGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gICBub1RyYWlsaW5nICAgICBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIG5vVHJhaWxpbmcgaXMgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBvbmx5IGV4ZWN1dGUgZXZlcnkgYGRlbGF5YCBtaWxsaXNlY29uZHMgd2hpbGUgdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZC1mdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQuIElmIG5vVHJhaWxpbmcgaXMgZmFsc2Ugb3IgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25lIGZpbmFsIHRpbWVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgdGhlIGxhc3QgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwuIChBZnRlciB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGhhcyBub3QgYmVlbiBjYWxsZWQgZm9yIGBkZWxheWAgbWlsbGlzZWNvbmRzLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgaW50ZXJuYWwgY291bnRlciBpcyByZXNldClcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgY2FsbGJhY2sgICAgICAgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBgY2FsbGJhY2tgIHdoZW4gdGhlIHRocm90dGxlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgZGVib3VuY2VNb2RlICAgSWYgYGRlYm91bmNlTW9kZWAgaXMgdHJ1ZSAoYXQgYmVnaW4pLCBzY2hlZHVsZSBgY2xlYXJgIHRvIGV4ZWN1dGUgYWZ0ZXIgYGRlbGF5YCBtcy4gSWYgYGRlYm91bmNlTW9kZWAgaXMgZmFsc2UgKGF0IGVuZCksXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlIGBjYWxsYmFja2AgdG8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLlxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAgQSBuZXcsIHRocm90dGxlZCwgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBkZWxheSwgbm9UcmFpbGluZywgY2FsbGJhY2ssIGRlYm91bmNlTW9kZSApIHtcblxuXHQvLyBBZnRlciB3cmFwcGVyIGhhcyBzdG9wcGVkIGJlaW5nIGNhbGxlZCwgdGhpcyB0aW1lb3V0IGVuc3VyZXMgdGhhdFxuXHQvLyBgY2FsbGJhY2tgIGlzIGV4ZWN1dGVkIGF0IHRoZSBwcm9wZXIgdGltZXMgaW4gYHRocm90dGxlYCBhbmQgYGVuZGBcblx0Ly8gZGVib3VuY2UgbW9kZXMuXG5cdHZhciB0aW1lb3V0SUQ7XG5cblx0Ly8gS2VlcCB0cmFjayBvZiB0aGUgbGFzdCB0aW1lIGBjYWxsYmFja2Agd2FzIGV4ZWN1dGVkLlxuXHR2YXIgbGFzdEV4ZWMgPSAwO1xuXG5cdC8vIGBub1RyYWlsaW5nYCBkZWZhdWx0cyB0byBmYWxzeS5cblx0aWYgKCB0eXBlb2Ygbm9UcmFpbGluZyAhPT0gJ2Jvb2xlYW4nICkge1xuXHRcdGRlYm91bmNlTW9kZSA9IGNhbGxiYWNrO1xuXHRcdGNhbGxiYWNrID0gbm9UcmFpbGluZztcblx0XHRub1RyYWlsaW5nID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gVGhlIGB3cmFwcGVyYCBmdW5jdGlvbiBlbmNhcHN1bGF0ZXMgYWxsIG9mIHRoZSB0aHJvdHRsaW5nIC8gZGVib3VuY2luZ1xuXHQvLyBmdW5jdGlvbmFsaXR5IGFuZCB3aGVuIGV4ZWN1dGVkIHdpbGwgbGltaXQgdGhlIHJhdGUgYXQgd2hpY2ggYGNhbGxiYWNrYFxuXHQvLyBpcyBleGVjdXRlZC5cblx0ZnVuY3Rpb24gd3JhcHBlciAoKSB7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIGVsYXBzZWQgPSBOdW1iZXIobmV3IERhdGUoKSkgLSBsYXN0RXhlYztcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuXHRcdC8vIEV4ZWN1dGUgYGNhbGxiYWNrYCBhbmQgdXBkYXRlIHRoZSBgbGFzdEV4ZWNgIHRpbWVzdGFtcC5cblx0XHRmdW5jdGlvbiBleGVjICgpIHtcblx0XHRcdGxhc3RFeGVjID0gTnVtYmVyKG5ldyBEYXRlKCkpO1xuXHRcdFx0Y2FsbGJhY2suYXBwbHkoc2VsZiwgYXJncyk7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgYGRlYm91bmNlTW9kZWAgaXMgdHJ1ZSAoYXQgYmVnaW4pIHRoaXMgaXMgdXNlZCB0byBjbGVhciB0aGUgZmxhZ1xuXHRcdC8vIHRvIGFsbG93IGZ1dHVyZSBgY2FsbGJhY2tgIGV4ZWN1dGlvbnMuXG5cdFx0ZnVuY3Rpb24gY2xlYXIgKCkge1xuXHRcdFx0dGltZW91dElEID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdGlmICggZGVib3VuY2VNb2RlICYmICF0aW1lb3V0SUQgKSB7XG5cdFx0XHQvLyBTaW5jZSBgd3JhcHBlcmAgaXMgYmVpbmcgY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZSBhbmRcblx0XHRcdC8vIGBkZWJvdW5jZU1vZGVgIGlzIHRydWUgKGF0IGJlZ2luKSwgZXhlY3V0ZSBgY2FsbGJhY2tgLlxuXHRcdFx0ZXhlYygpO1xuXHRcdH1cblxuXHRcdC8vIENsZWFyIGFueSBleGlzdGluZyB0aW1lb3V0LlxuXHRcdGlmICggdGltZW91dElEICkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRJRCk7XG5cdFx0fVxuXG5cdFx0aWYgKCBkZWJvdW5jZU1vZGUgPT09IHVuZGVmaW5lZCAmJiBlbGFwc2VkID4gZGVsYXkgKSB7XG5cdFx0XHQvLyBJbiB0aHJvdHRsZSBtb2RlLCBpZiBgZGVsYXlgIHRpbWUgaGFzIGJlZW4gZXhjZWVkZWQsIGV4ZWN1dGVcblx0XHRcdC8vIGBjYWxsYmFja2AuXG5cdFx0XHRleGVjKCk7XG5cblx0XHR9IGVsc2UgaWYgKCBub1RyYWlsaW5nICE9PSB0cnVlICkge1xuXHRcdFx0Ly8gSW4gdHJhaWxpbmcgdGhyb3R0bGUgbW9kZSwgc2luY2UgYGRlbGF5YCB0aW1lIGhhcyBub3QgYmVlblxuXHRcdFx0Ly8gZXhjZWVkZWQsIHNjaGVkdWxlIGBjYWxsYmFja2AgdG8gZXhlY3V0ZSBgZGVsYXlgIG1zIGFmdGVyIG1vc3Rcblx0XHRcdC8vIHJlY2VudCBleGVjdXRpb24uXG5cdFx0XHQvL1xuXHRcdFx0Ly8gSWYgYGRlYm91bmNlTW9kZWAgaXMgdHJ1ZSAoYXQgYmVnaW4pLCBzY2hlZHVsZSBgY2xlYXJgIHRvIGV4ZWN1dGVcblx0XHRcdC8vIGFmdGVyIGBkZWxheWAgbXMuXG5cdFx0XHQvL1xuXHRcdFx0Ly8gSWYgYGRlYm91bmNlTW9kZWAgaXMgZmFsc2UgKGF0IGVuZCksIHNjaGVkdWxlIGBjYWxsYmFja2AgdG9cblx0XHRcdC8vIGV4ZWN1dGUgYWZ0ZXIgYGRlbGF5YCBtcy5cblx0XHRcdHRpbWVvdXRJRCA9IHNldFRpbWVvdXQoZGVib3VuY2VNb2RlID8gY2xlYXIgOiBleGVjLCBkZWJvdW5jZU1vZGUgPT09IHVuZGVmaW5lZCA/IGRlbGF5IC0gZWxhcHNlZCA6IGRlbGF5KTtcblx0XHR9XG5cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgd3JhcHBlciBmdW5jdGlvbi5cblx0cmV0dXJuIHdyYXBwZXI7XG5cbn07XG4iLCJcbiAvKiFcbiAqIFdpbmRvd0V2ZW50cy5qc1xuICogQGF1dGhvciBQZXRlIERyb2xsIDxkcm9sbC5wQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5pbXBvcnQgcHVibGlzaGVyIGZyb20gJ2NvdmpzJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICd0aHJvdHRsZS1kZWJvdW5jZS9kZWJvdW5jZSc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvdGhyb3R0bGUnO1xuaW1wb3J0IFNjcm9sbEV2ZW50cyBmcm9tICcuL3Njcm9sbCc7XG5pbXBvcnQgUmVzaXplRXZlbnRzIGZyb20gJy4vcmVzaXplJztcbmltcG9ydCBWaXNpYmlsaXR5RXZlbnRzIGZyb20gJy4vdmlzaWJpbGl0eSc7XG5cbmNsYXNzIFdpbmRvd0V2ZW50cyB7XG5cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgc2Nyb2xsRGVsYXk6IDEwMCxcbiAgICAgIHJlc2l6ZURlbGF5OiAzNTAsXG4gICAgfTtcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdHMgPyB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH0gOiBkZWZhdWx0T3B0aW9ucztcbiAgICB0aGlzLm9uID0gcHVibGlzaGVyLm9uO1xuICAgIHRoaXMub25jZSA9IHB1Ymxpc2hlci5vbmNlO1xuICAgIHRoaXMub2ZmID0gcHVibGlzaGVyLm9mZjtcblxuICAgIGNvbnN0IHJlc2l6ZUV2ZW50cyA9IG5ldyBSZXNpemVFdmVudHMocHVibGlzaGVyLCB0aGlzLm9wdGlvbnMpO1xuICAgIC8vIFBhc3MgcmVzaXplRXZlbnRzIG9iamVjdCB0byBzY3JvbGwgbGlzdGVuZXJcbiAgICAvLyBpbiBvcmRlciB0byBoYXZlIGFjY2VzcyB0byB3aW5kb3cgaGVpZ2h0LCB3aWR0aFxuICAgIGNvbnN0IHNjcm9sbEV2ZW50cyA9IG5ldyBTY3JvbGxFdmVudHMocHVibGlzaGVyLCB0aGlzLm9wdGlvbnMsIHJlc2l6ZUV2ZW50cyk7XG4gICAgY29uc3QgdmlzaWJpbGl0eUV2ZW50cyA9IG5ldyBWaXNpYmlsaXR5RXZlbnRzKHB1Ymxpc2hlciwgdGhpcy5vcHRpb25zKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXksXG4gICAgICAvLyBBdCBiZWdpbm5pbmdcbiAgICAgIHRydWUsXG4gICAgICAvLyBEZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgIHNjcm9sbEV2ZW50cy5kZWJvdW5jZWRMaXN0ZW5lcixcbiAgICApKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhyb3R0bGUoXG4gICAgICAvLyBEZWxheVxuICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbERlbGF5LFxuICAgICAgLy8gTm8gVHJhaWxpbmcuIElmIGZhbHNlLCB3aWxsIGdldCBjYWxsZWQgb25lIGxhc3QgdGltZSBhZnRlciB0aGUgbGFzdCB0aHJvdHRsZWQgY2FsbFxuICAgICAgZmFsc2UsXG4gICAgICAvLyBUaHJvdHRsZWQgZnVuY3Rpb25cbiAgICAgIHNjcm9sbEV2ZW50cy50aHJvdHRsZWRMaXN0ZW5lcixcbiAgICApKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZGVib3VuY2UoXG4gICAgICAvLyBEZWxheVxuICAgICAgdGhpcy5vcHRpb25zLnJlc2l6ZURlbGF5LFxuICAgICAgLy8gQXQgYmVnaW5uaW5nXG4gICAgICB0cnVlLFxuICAgICAgLy8gRGVib3VuY2VkIGZ1bmN0aW9uXG4gICAgICByZXNpemVFdmVudHMuZGVib3VuY2VkTGlzdGVuZXIsXG4gICAgKSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRocm90dGxlKFxuICAgICAgLy8gRGVsYXlcbiAgICAgIHRoaXMub3B0aW9ucy5yZXNpemVEZWxheSxcbiAgICAgIC8vIE5vIFRyYWlsaW5nLiBJZiBmYWxzZSwgd2lsbCBnZXQgY2FsbGVkIG9uZSBsYXN0IHRpbWUgYWZ0ZXIgdGhlIGxhc3QgdGhyb3R0bGVkIGNhbGxcbiAgICAgIGZhbHNlLFxuICAgICAgLy8gVGhyb3R0bGVkIGZ1bmN0aW9uXG4gICAgICByZXNpemVFdmVudHMudGhyb3R0bGVkTGlzdGVuZXIsXG4gICAgKSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHZpc2liaWxpdHlFdmVudHMuY2hhbmdlTGlzdGVudGVyKTtcblxuICAgIHRoaXMuZ2V0U3RhdGUgPSAoKSA9PiAoe1xuICAgICAgLi4ucmVzaXplRXZlbnRzLmdldFN0YXRlKCksXG4gICAgICAuLi5zY3JvbGxFdmVudHMuZ2V0U3RhdGUoKSxcbiAgICAgIC4uLnZpc2liaWxpdHlFdmVudHMuZ2V0U3RhdGUoKSxcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd0V2ZW50cztcbiIsImNsYXNzIFJlc2l6ZUV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHB1Ymxpc2hlciwgb3B0aW9ucykge1xuICAgIHRoaXMuc2lnbmFsID0gcHVibGlzaGVyLnNpZ25hbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5sYXN0SCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5sYXN0VyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5sYXN0UyA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLmxhc3RPID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnO1xuICAgIHRoaXMucmVzaXplVGltZW91dCA9IG51bGw7XG5cbiAgICB0aGlzLmRlYm91bmNlZExpc3RlbmVyID0gdGhpcy5kZWJvdW5jZWRMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMudGhyb3R0bGVkTGlzdGVuZXIgPSB0aGlzLnRocm90dGxlZExpc3RlbmVyLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgc2Nyb2xsSGVpZ2h0OiB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uLFxuICAgIH07XG4gIH1cblxuICBkZWJvdW5jZWRMaXN0ZW5lcigpIHtcbiAgICB0aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodDtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnO1xuXG4gICAgY29uc3Qgc2l6ZU9iaiA9IHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvbixcbiAgICB9O1xuXG4gICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zdGFydCcsIFtzaXplT2JqXSk7XG5cbiAgICB0aGlzLmxhc3RIID0gdGhpcy5oZWlnaHQ7XG4gICAgdGhpcy5sYXN0VyA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0O1xuICB9XG5cbiAgdGhyb3R0bGVkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMuaGVpZ2h0ID4gdGhpcy53aWR0aCA/ICdwb3J0cmFpdCcgOiAnbGFuZHNjYXBlJztcblxuICAgIGNvbnN0IHNpemVPYmogPSB7XG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBzY3JvbGxIZWlnaHQ6IHRoaXMuc2Nyb2xsSGVpZ2h0LFxuICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb24sXG4gICAgfTtcblxuICAgIHRoaXMuc2lnbmFsKCdyZXNpemUnLCBbc2l6ZU9ial0pO1xuXG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24gIT09IHRoaXMubGFzdE8pIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdyZXNpemUub3JpZW50YXRpb25DaGFuZ2UnLCBbc2l6ZU9ial0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCAhPT0gdGhpcy5sYXN0Uykge1xuICAgICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zY3JvbGxIZWlnaHRDaGFuZ2UnLCBbc2l6ZU9ial0pO1xuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpO1xuICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zdG9wJywgW3NpemVPYmpdKTtcbiAgICB9LCB0aGlzLm9wdGlvbnMucmVzaXplRGVsYXkgKyAxKTtcblxuICAgIHRoaXMubGFzdEggPSB0aGlzLmhlaWdodDtcbiAgICB0aGlzLmxhc3RXID0gdGhpcy53aWR0aDtcbiAgICB0aGlzLmxhc3RTID0gdGhpcy5zY3JvbGxIZWlnaHQ7XG4gICAgdGhpcy5sYXN0TyA9IHRoaXMub3JpZW50YXRpb247XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzaXplRXZlbnRzO1xuIiwiY2xhc3MgU2Nyb2xsRXZlbnRzIHtcbiAgY29uc3RydWN0b3IocHVibGlzaGVyLCBvcHRpb25zLCBzaXplUmVmKSB7XG4gICAgdGhpcy5zaWduYWwgPSBwdWJsaXNoZXIuc2lnbmFsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSB0aGlzLmxhc3RTY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgdGhpcy53aW5kb3dTaXplID0gc2l6ZVJlZjtcbiAgICB0aGlzLnNjcm9sbFRpbWVvdXQgPSBudWxsO1xuXG4gICAgdGhpcy5kZWJvdW5jZWRMaXN0ZW5lciA9IHRoaXMuZGVib3VuY2VkTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRocm90dGxlZExpc3RlbmVyID0gdGhpcy50aHJvdHRsZWRMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0U3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OlxuICAgICAgICAodGhpcy5zY3JvbGxUb3AgLyAodGhpcy53aW5kb3dTaXplLnNjcm9sbEhlaWdodCAtIHRoaXMud2luZG93U2l6ZS5oZWlnaHQpKSAqIDEwMCxcbiAgICB9O1xuICB9XG5cbiAgZGVib3VuY2VkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgdGhpcy5zaWduYWwoJ3Njcm9sbC5zdGFydCcsIFt7XG4gICAgICBzY3JvbGxUb3A6IHRoaXMuc2Nyb2xsVG9wLFxuICAgICAgc2Nyb2xsUGVyY2VudDpcbiAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIC8gKHRoaXMud2luZG93U2l6ZS5zY3JvbGxIZWlnaHQgLSB0aGlzLndpbmRvd1NpemUuaGVpZ2h0KSkgKiAxMDAsXG4gICAgfV0pO1xuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3A7XG4gIH1cblxuICB0aHJvdHRsZWRMaXN0ZW5lcigpIHtcbiAgICB0aGlzLnNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldDtcblxuICAgIGNvbnN0IHNjcm9sbE9iaiA9IHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OlxuICAgICAgICAodGhpcy5zY3JvbGxUb3AgLyAodGhpcy53aW5kb3dTaXplLnNjcm9sbEhlaWdodCAtIHRoaXMud2luZG93U2l6ZS5oZWlnaHQpKSAqIDEwMCxcbiAgICB9O1xuXG4gICAgdGhpcy5zaWduYWwoJ3Njcm9sbCcsIFtzY3JvbGxPYmpdKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbFRvcCA+IHRoaXMubGFzdFNjcm9sbFRvcCkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Njcm9sbC5kb3duJywgW3Njcm9sbE9ial0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zY3JvbGxUb3AgPCB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwudXAnLCBbc2Nyb2xsT2JqXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2Nyb2xsVG9wIDw9IDApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwudG9wJywgW3Njcm9sbE9ial0pO1xuICAgIH1cblxuICAgIGlmIChzY3JvbGxPYmouc2Nyb2xsUGVyY2VudCA+PSAxMDApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwuYm90dG9tJywgW3Njcm9sbE9ial0pO1xuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpO1xuICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zaWduYWwoJ3Njcm9sbC5zdG9wJywgW3Njcm9sbE9ial0pO1xuICAgIH0sIHRoaXMub3B0aW9ucy5zY3JvbGxEZWxheSArIDEpO1xuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3A7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2Nyb2xsRXZlbnRzO1xuIiwiY2xhc3MgVmlzaWJpbGl0eUV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHB1Ymxpc2hlciwgb3B0aW9ucykge1xuICAgIHRoaXMuc2lnbmFsID0gcHVibGlzaGVyLnNpZ25hbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy52aXNpYmxlID0gIWRvY3VtZW50LmhpZGRlbjtcblxuICAgIHRoaXMuY2hhbmdlTGlzdGVudGVyID0gdGhpcy5jaGFuZ2VMaXN0ZW50ZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICB2aXNpYmxlOiB0aGlzLnZpc2libGUsXG4gICAgfTtcbiAgfVxuXG4gIGNoYW5nZUxpc3RlbnRlcigpIHtcbiAgICB0aGlzLnZpc2libGUgPSAhZG9jdW1lbnQuaGlkZGVuO1xuXG4gICAgY29uc3QgdmlzaWJsZU9iaiA9IHtcbiAgICAgIHZpc2libGU6IHRoaXMudmlzaWJsZSxcbiAgICB9O1xuXG4gICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2UnLCBbdmlzaWJsZU9ial0pO1xuXG4gICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2Uuc2hvdycsIFt2aXNpYmxlT2JqXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2lnbmFsKCd2aXNpYmlsaXR5Q2hhbmdlLmhpZGUnLCBbdmlzaWJsZU9ial0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWaXNpYmlsaXR5RXZlbnRzO1xuIl19
