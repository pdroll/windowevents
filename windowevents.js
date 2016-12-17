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
  var _this = this;

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

  this.updateState = function () {
    resizeEvents.updateState();
    scrollEvents.updateState();
    visibilityEvents.updateState();
    return _this.getState();
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
    this.resizeTimeout = null;

    this.debouncedListener = this.debouncedListener.bind(this);
    this.throttledListener = this.throttledListener.bind(this);

    this.updateState();
  }

  _createClass(ResizeEvents, [{
    key: 'updateState',
    value: function updateState() {
      this.height = this.lastH = window.innerHeight;
      this.width = this.lastW = window.innerWidth;
      this.scrollHeight = this.lastS = document.body.scrollHeight;
      this.orientation = this.lastO = this.height > this.width ? 'portrait' : 'landscape';
    }
  }, {
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
    this.windowSize = sizeRef;
    this.scrollTimeout = null;

    this.debouncedListener = this.debouncedListener.bind(this);
    this.throttledListener = this.throttledListener.bind(this);

    this.updateState();
  }

  _createClass(ScrollEvents, [{
    key: 'updateState',
    value: function updateState() {
      this.scrollTop = this.lastScrollTop = window.scrollY || window.pageYOffset;
      this.scrollPercent = this.scrollTop / (this.windowSize.scrollHeight - this.windowSize.height) * 100;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return {
        scrollTop: this.scrollTop,
        scrollPercent: this.scrollPercent
      };
    }
  }, {
    key: 'debouncedListener',
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
    key: 'throttledListener',
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

    this.changeListenter = this.changeListenter.bind(this);

    this.updateState();
  }

  _createClass(VisibilityEvents, [{
    key: 'updateState',
    value: function updateState() {
      this.visible = !document.hidden;
    }
  }, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY292anMvY292LmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL3Rocm90dGxlLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3Jlc2l6ZS5qcyIsInNyYy9zY3JvbGwuanMiLCJzcmMvdmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3JGQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7QUFWQzs7Ozs7OztJQVlLLFksR0FFSixzQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUE7O0FBQ2hCLE1BQU0saUJBQWlCO0FBQ3JCLGlCQUFhLEdBRFE7QUFFckIsaUJBQWE7QUFGUSxHQUF2Qjs7QUFLQSxPQUFLLE9BQUwsR0FBZSxvQkFBWSxjQUFaLEVBQStCLElBQS9CLElBQXdDLGNBQXZEO0FBQ0EsT0FBSyxFQUFMLEdBQVUsZ0JBQVUsRUFBcEI7QUFDQSxPQUFLLElBQUwsR0FBWSxnQkFBVSxJQUF0QjtBQUNBLE9BQUssR0FBTCxHQUFXLGdCQUFVLEdBQXJCOztBQUVBLE1BQU0sZUFBZSxzQ0FBNEIsS0FBSyxPQUFqQyxDQUFyQjtBQUNBO0FBQ0E7QUFDQSxNQUFNLGVBQWUsc0NBQTRCLEtBQUssT0FBakMsRUFBMEMsWUFBMUMsQ0FBckI7QUFDQSxNQUFNLG1CQUFtQiwwQ0FBZ0MsS0FBSyxPQUFyQyxDQUF6Qjs7QUFFQSxTQUFPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDO0FBQ2hDO0FBQ0EsT0FBSyxPQUFMLENBQWEsV0FGbUI7QUFHaEM7QUFDQSxNQUpnQztBQUtoQztBQUNBLGVBQWEsaUJBTm1CLENBQWxDO0FBUUEsU0FBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQztBQUNoQztBQUNBLE9BQUssT0FBTCxDQUFhLFdBRm1CO0FBR2hDO0FBQ0EsT0FKZ0M7QUFLaEM7QUFDQSxlQUFhLGlCQU5tQixDQUFsQztBQVFBLFNBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0M7QUFDaEM7QUFDQSxPQUFLLE9BQUwsQ0FBYSxXQUZtQjtBQUdoQztBQUNBLE1BSmdDO0FBS2hDO0FBQ0EsZUFBYSxpQkFObUIsQ0FBbEM7QUFRQSxTQUFPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDO0FBQ2hDO0FBQ0EsT0FBSyxPQUFMLENBQWEsV0FGbUI7QUFHaEM7QUFDQSxPQUpnQztBQUtoQztBQUNBLGVBQWEsaUJBTm1CLENBQWxDOztBQVNBLFNBQU8sZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLGlCQUFpQixlQUE3RDs7QUFFQSxPQUFLLFFBQUwsR0FBZ0I7QUFBQSx3QkFDWCxhQUFhLFFBQWIsRUFEVyxFQUVYLGFBQWEsUUFBYixFQUZXLEVBR1gsaUJBQWlCLFFBQWpCLEVBSFc7QUFBQSxHQUFoQjs7QUFNQSxPQUFLLFdBQUwsR0FBbUIsWUFBTTtBQUN2QixpQkFBYSxXQUFiO0FBQ0EsaUJBQWEsV0FBYjtBQUNBLHFCQUFpQixXQUFqQjtBQUNBLFdBQU8sTUFBSyxRQUFMLEVBQVA7QUFDRCxHQUxEO0FBTUQsQzs7QUFHSCxPQUFPLE9BQVAsR0FBaUIsWUFBakI7Ozs7Ozs7Ozs7Ozs7SUNsRk0sWTtBQUNKLHdCQUFZLFNBQVosRUFBdUIsT0FBdkIsRUFBZ0M7QUFBQTs7QUFDOUIsU0FBSyxNQUFMLEdBQWMsVUFBVSxNQUF4QjtBQUNBLFNBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxTQUFLLGFBQUwsR0FBcUIsSUFBckI7O0FBRUEsU0FBSyxpQkFBTCxHQUF5QixLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQXpCO0FBQ0EsU0FBSyxpQkFBTCxHQUF5QixLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQXpCOztBQUVBLFNBQUssV0FBTDtBQUNEOzs7O2tDQUVhO0FBQ1osV0FBSyxNQUFMLEdBQWMsS0FBSyxLQUFMLEdBQWEsT0FBTyxXQUFsQztBQUNBLFdBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxHQUFhLE9BQU8sVUFBakM7QUFDQSxXQUFLLFlBQUwsR0FBb0IsS0FBSyxLQUFMLEdBQWEsU0FBUyxJQUFULENBQWMsWUFBL0M7QUFDQSxXQUFLLFdBQUwsR0FBbUIsS0FBSyxLQUFMLEdBQWEsS0FBSyxNQUFMLEdBQWMsS0FBSyxLQUFuQixHQUEyQixVQUEzQixHQUF3QyxXQUF4RTtBQUNEOzs7K0JBRVU7QUFDVCxhQUFPO0FBQ0wsZ0JBQVEsS0FBSyxNQURSO0FBRUwsZUFBTyxLQUFLLEtBRlA7QUFHTCxzQkFBYyxLQUFLLFlBSGQ7QUFJTCxxQkFBYSxLQUFLO0FBSmIsT0FBUDtBQU1EOzs7d0NBRW1CO0FBQ2xCLFdBQUssTUFBTCxHQUFjLE9BQU8sV0FBckI7QUFDQSxXQUFLLEtBQUwsR0FBYSxPQUFPLFVBQXBCO0FBQ0EsV0FBSyxZQUFMLEdBQW9CLFNBQVMsSUFBVCxDQUFjLFlBQWxDO0FBQ0EsV0FBSyxXQUFMLEdBQW1CLEtBQUssTUFBTCxHQUFjLEtBQUssS0FBbkIsR0FBMkIsVUFBM0IsR0FBd0MsV0FBM0Q7O0FBRUEsVUFBTSxVQUFVO0FBQ2QsZ0JBQVEsS0FBSyxNQURDO0FBRWQsZUFBTyxLQUFLLEtBRkU7QUFHZCxzQkFBYyxLQUFLLFlBSEw7QUFJZCxxQkFBYSxLQUFLO0FBSkosT0FBaEI7O0FBT0EsV0FBSyxNQUFMLENBQVksY0FBWixFQUE0QixDQUFDLE9BQUQsQ0FBNUI7O0FBRUEsV0FBSyxLQUFMLEdBQWEsS0FBSyxNQUFsQjtBQUNBLFdBQUssS0FBTCxHQUFhLEtBQUssS0FBbEI7QUFDQSxXQUFLLEtBQUwsR0FBYSxLQUFLLFlBQWxCO0FBQ0Q7Ozt3Q0FFbUI7QUFBQTs7QUFDbEIsV0FBSyxNQUFMLEdBQWMsT0FBTyxXQUFyQjtBQUNBLFdBQUssS0FBTCxHQUFhLE9BQU8sVUFBcEI7QUFDQSxXQUFLLFlBQUwsR0FBb0IsU0FBUyxJQUFULENBQWMsWUFBbEM7QUFDQSxXQUFLLFdBQUwsR0FBbUIsS0FBSyxNQUFMLEdBQWMsS0FBSyxLQUFuQixHQUEyQixVQUEzQixHQUF3QyxXQUEzRDs7QUFFQSxVQUFNLFVBQVU7QUFDZCxnQkFBUSxLQUFLLE1BREM7QUFFZCxlQUFPLEtBQUssS0FGRTtBQUdkLHNCQUFjLEtBQUssWUFITDtBQUlkLHFCQUFhLEtBQUs7QUFKSixPQUFoQjs7QUFPQSxXQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQXNCLENBQUMsT0FBRCxDQUF0Qjs7QUFFQSxVQUFJLEtBQUssV0FBTCxLQUFxQixLQUFLLEtBQTlCLEVBQXFDO0FBQ25DLGFBQUssTUFBTCxDQUFZLDBCQUFaLEVBQXdDLENBQUMsT0FBRCxDQUF4QztBQUNEOztBQUVELFVBQUksS0FBSyxZQUFMLEtBQXNCLEtBQUssS0FBL0IsRUFBc0M7QUFDcEMsYUFBSyxNQUFMLENBQVksMkJBQVosRUFBeUMsQ0FBQyxPQUFELENBQXpDO0FBQ0Q7O0FBRUQsbUJBQWEsS0FBSyxhQUFsQjtBQUNBLFdBQUssYUFBTCxHQUFxQixXQUFXLFlBQU07QUFDcEMsY0FBSyxNQUFMLENBQVksYUFBWixFQUEyQixDQUFDLE9BQUQsQ0FBM0I7QUFDRCxPQUZvQixFQUVsQixLQUFLLE9BQUwsQ0FBYSxXQUFiLEdBQTJCLENBRlQsQ0FBckI7O0FBSUEsV0FBSyxLQUFMLEdBQWEsS0FBSyxNQUFsQjtBQUNBLFdBQUssS0FBTCxHQUFhLEtBQUssS0FBbEI7QUFDQSxXQUFLLEtBQUwsR0FBYSxLQUFLLFlBQWxCO0FBQ0EsV0FBSyxLQUFMLEdBQWEsS0FBSyxXQUFsQjtBQUNEOzs7Ozs7a0JBR1ksWTs7Ozs7Ozs7Ozs7OztJQ25GVCxZO0FBQ0osd0JBQVksU0FBWixFQUF1QixPQUF2QixFQUFnQyxPQUFoQyxFQUF5QztBQUFBOztBQUN2QyxTQUFLLE1BQUwsR0FBYyxVQUFVLE1BQXhCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFNBQUssVUFBTCxHQUFrQixPQUFsQjtBQUNBLFNBQUssYUFBTCxHQUFxQixJQUFyQjs7QUFFQSxTQUFLLGlCQUFMLEdBQXlCLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBekI7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBekI7O0FBRUEsU0FBSyxXQUFMO0FBQ0Q7Ozs7a0NBRWE7QUFDWixXQUFLLFNBQUwsR0FBaUIsS0FBSyxhQUFMLEdBQXFCLE9BQU8sT0FBUCxJQUFrQixPQUFPLFdBQS9EO0FBQ0EsV0FBSyxhQUFMLEdBQ0ssS0FBSyxTQUFMLElBQWtCLEtBQUssVUFBTCxDQUFnQixZQUFoQixHQUErQixLQUFLLFVBQUwsQ0FBZ0IsTUFBakUsQ0FBRCxHQUE2RSxHQURqRjtBQUVEOzs7K0JBRVU7QUFDVCxhQUFPO0FBQ0wsbUJBQVcsS0FBSyxTQURYO0FBRUwsdUJBQWUsS0FBSztBQUZmLE9BQVA7QUFJRDs7O3dDQUVtQjtBQUNsQixXQUFLLFNBQUwsR0FBaUIsT0FBTyxPQUFQLElBQWtCLE9BQU8sV0FBMUM7QUFDQSxXQUFLLGFBQUwsR0FDSyxLQUFLLFNBQUwsSUFBa0IsS0FBSyxVQUFMLENBQWdCLFlBQWhCLEdBQStCLEtBQUssVUFBTCxDQUFnQixNQUFqRSxDQUFELEdBQTZFLEdBRGpGOztBQUdBLFdBQUssTUFBTCxDQUFZLGNBQVosRUFBNEIsQ0FBQztBQUMzQixtQkFBVyxLQUFLLFNBRFc7QUFFM0IsdUJBQWUsS0FBSztBQUZPLE9BQUQsQ0FBNUI7O0FBS0EsV0FBSyxhQUFMLEdBQXFCLEtBQUssU0FBMUI7QUFDRDs7O3dDQUVtQjtBQUFBOztBQUNsQixXQUFLLFNBQUwsR0FBaUIsT0FBTyxPQUFQLElBQWtCLE9BQU8sV0FBMUM7QUFDQSxXQUFLLGFBQUwsR0FDSyxLQUFLLFNBQUwsSUFBa0IsS0FBSyxVQUFMLENBQWdCLFlBQWhCLEdBQStCLEtBQUssVUFBTCxDQUFnQixNQUFqRSxDQUFELEdBQTZFLEdBRGpGOztBQUdBLFVBQU0sWUFBWTtBQUNoQixtQkFBVyxLQUFLLFNBREE7QUFFaEIsdUJBQWUsS0FBSztBQUZKLE9BQWxCOztBQUtBLFdBQUssTUFBTCxDQUFZLFFBQVosRUFBc0IsQ0FBQyxTQUFELENBQXRCOztBQUVBLFVBQUksS0FBSyxTQUFMLEdBQWlCLEtBQUssYUFBMUIsRUFBeUM7QUFDdkMsYUFBSyxNQUFMLENBQVksYUFBWixFQUEyQixDQUFDLFNBQUQsQ0FBM0I7QUFDRCxPQUZELE1BRU8sSUFBSSxLQUFLLFNBQUwsR0FBaUIsS0FBSyxhQUExQixFQUF5QztBQUM5QyxhQUFLLE1BQUwsQ0FBWSxXQUFaLEVBQXlCLENBQUMsU0FBRCxDQUF6QjtBQUNEOztBQUVELFVBQUksS0FBSyxTQUFMLElBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGFBQUssTUFBTCxDQUFZLFlBQVosRUFBMEIsQ0FBQyxTQUFELENBQTFCO0FBQ0Q7O0FBRUQsVUFBSSxVQUFVLGFBQVYsSUFBMkIsR0FBL0IsRUFBb0M7QUFDbEMsYUFBSyxNQUFMLENBQVksZUFBWixFQUE2QixDQUFDLFNBQUQsQ0FBN0I7QUFDRDs7QUFFRCxtQkFBYSxLQUFLLGFBQWxCO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLFdBQVcsWUFBTTtBQUNwQyxjQUFLLE1BQUwsQ0FBWSxhQUFaLEVBQTJCLENBQUMsU0FBRCxDQUEzQjtBQUNELE9BRm9CLEVBRWxCLEtBQUssT0FBTCxDQUFhLFdBQWIsR0FBMkIsQ0FGVCxDQUFyQjs7QUFJQSxXQUFLLGFBQUwsR0FBcUIsS0FBSyxTQUExQjtBQUNEOzs7Ozs7a0JBR1ksWTs7Ozs7Ozs7Ozs7OztJQzFFVCxnQjtBQUNKLDRCQUFZLFNBQVosRUFBdUIsT0FBdkIsRUFBZ0M7QUFBQTs7QUFDOUIsU0FBSyxNQUFMLEdBQWMsVUFBVSxNQUF4QjtBQUNBLFNBQUssT0FBTCxHQUFlLE9BQWY7O0FBRUEsU0FBSyxlQUFMLEdBQXVCLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUF2Qjs7QUFFQSxTQUFLLFdBQUw7QUFDRDs7OztrQ0FFYTtBQUNaLFdBQUssT0FBTCxHQUFlLENBQUMsU0FBUyxNQUF6QjtBQUNEOzs7K0JBRVU7QUFDVCxhQUFPO0FBQ0wsaUJBQVMsS0FBSztBQURULE9BQVA7QUFHRDs7O3NDQUVpQjtBQUNoQixXQUFLLE9BQUwsR0FBZSxDQUFDLFNBQVMsTUFBekI7O0FBRUEsVUFBTSxhQUFhO0FBQ2pCLGlCQUFTLEtBQUs7QUFERyxPQUFuQjs7QUFJQSxXQUFLLE1BQUwsQ0FBWSxrQkFBWixFQUFnQyxDQUFDLFVBQUQsQ0FBaEM7O0FBRUEsVUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEIsYUFBSyxNQUFMLENBQVksdUJBQVosRUFBcUMsQ0FBQyxVQUFELENBQXJDO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxNQUFMLENBQVksdUJBQVosRUFBcUMsQ0FBQyxVQUFELENBQXJDO0FBQ0Q7QUFDRjs7Ozs7O2tCQUdZLGdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQGF1dGhvciBEYXZlIERldm9yIDxkYXZlZGV2b3JAZ21haWwuY29tPlxuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgdmFyaWFibGUgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKlxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIF9pc0ZuKGZuKSB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIFN0b3JlIGluY3JlbWVudGluZyBJRCBmb3IgZWFjaCBwYXNzZWQgY2FsbGJhY2tcbiAqIEB0eXBlICB7SW50fVxuICovXG52YXIgY2FsbGJhY2tJZCA9IDA7XG5cbi8qKlxuICogU3RvcmUgYWxsIG9mIG91ciBjb3ZlbmFudHNcbiAqIEB0eXBlICB7QXJyYXl9XG4gKi9cbnZhciBjb3ZlbmFudHMgPSBbXTtcblxuLyoqXG4gKiBPbmUgb2JqZWN0IHRvIGhvbGQgYWxsIG9mIHRoZSBhcHBzIGNvdmVuYW50cy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBDb3YgPSB7XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGFuIGV2ZW50LCBvciBhZGQgdG8gYW4gZXhpc3RpbmcgZXZlbnRcblx0ICogQHBhcmFtICAge1N0cmluZ30gIG5hbWUgICAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCdcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgVGhlIGNsb3N1cmUgdG8gZXhlY3V0ZSB3aGVuIHNpZ25hbGVkLlxuXHQgKiBAcmV0dXJuICB7TWl4ZWR9ICAgICAgICAgICBVbmlxdWUgSUQgZm9yIGxpc3RlbmVyIG9yIGZhbHNlIG9uIGluY29ycmVjdCBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRvbjogZnVuY3Rpb24gb24oKSB7XG5cdFx0dmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1swXTtcblx0XHR2YXIgZm4gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgZm4gaXMgYSBmdW5jdGlvblxuXHRcdHZhciBpc0ZuID0gX2lzRm4oZm4pO1xuXG5cdFx0aWYgKG5hbWUgJiYgZm4gJiYgaXNGbikge1xuXHRcdFx0dmFyIF9leGlzdHMgPSBmYWxzZTtcblx0XHRcdHZhciBjYk9iaiA9IHtcblx0XHRcdFx0aWQ6ICdjb3ZfJyArICgrK2NhbGxiYWNrSWQpLFxuXHRcdFx0XHRmbjogZm5cblx0XHRcdH1cblxuXHRcdFx0Ly8gY2hlY2sgaWYgdGhpcyBldmVuIGV4aXN0c1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdikge1xuXHRcdFx0XHQvLyBJZiBpdCBhbHJlYWR5IGV4aXN0cywgYWRkIHRoZSBmdW5jdGlvbiB0byBpdHMgZnVuY3Rpb25zLlxuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLnB1c2goY2JPYmopO1xuXHRcdFx0XHRcdF9leGlzdHMgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIElmIGl0IGRvZXNudCBleGlzdCBjcmVhdGUgaXQuXG5cdFx0XHRpZiAoIV9leGlzdHMpIHtcblx0XHRcdFx0dmFyIG5ld0NvdmVuYW50ID0ge1xuXHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0Y2FsbGJhY2tzOiBbY2JPYmpdXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Y292ZW5hbnRzLnB1c2gobmV3Q292ZW5hbnQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNiT2JqLmlkO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgYW4gZXZlbnQgdG8gZmlyZSBvbmx5IG9uY2Vcblx0ICogQHBhcmFtICAge1N0cmluZ30gIG5hbWUgICAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCdcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgVGhlIGNsb3N1cmUgdG8gZXhlY3V0ZSB3aGVuIHNpZ25hbGVkLlxuXHQgKiBAcmV0dXJuICB7TWl4ZWR9ICAgICAgICAgICBVbmlxdWUgSUQgZm9yIGxpc3RlbmVyIG9yIGZhbHNlIG9uIGluY29ycmVjdCBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRvbmNlOiBmdW5jdGlvbiBvbmNlKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGZuID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHR2YXIgbmV3SWQgPSAnY292XycgKyAoY2FsbGJhY2tJZCArIDEpO1xuXHRcdHZhciBvbmVUaW1lRnVuYyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0XHRcdHRoaXMub2ZmKG5hbWUsIG5ld0lkKTtcblx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLm9uKG5hbWUsIG9uZVRpbWVGdW5jKTtcblxuXHRcdHJldHVybiBuZXdJZDtcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBTaWduYWwgYW4gZXZlbnQgYW5kIHJ1biBhbGwgb2YgaXRzIHN1YnNjcmliZWQgZnVuY3Rpb25zLlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICAgIG5hbWUgIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnO1xuXHQgKiBAcGFyYW0gIHtvYmplY3RbXX0gIGFyZ3MgIEFueSBhcmd1bWVudHMgdGhhdCBuZWVkIHRvIGJlIHNlbnQgdG8gdGhlICBmblxuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgIEN1cnJlbnQgaW5zdGFuY2Ugb2YgQ292LCB0byBhbGxvdyBmb3IgY2hhaW5pbmdcblx0ICovXG5cdHNpZ25hbDogZnVuY3Rpb24gc2lnbmFsKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1sxXTtcblxuXG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YpIHtcblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNiT2JqKSB7XG5cdFx0XHRcdFx0XHRjYk9iai5mbi5hcHBseShudWxsLCBhcmdzKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblxuXHQvKipcblx0ICogVW5yZWdpc3RlciAodHVybiBvZmYpIGFuIGV2ZW50LlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJztcblx0ICogQHBhcmFtICB7U3RyaW5nfSAgSUQgb2YgbGlzdGVuZXIgYXMgcmV0dXJuZWQgYnkgYG9uYCBmdW5jdGlvblxuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICBDdXJyZW50IGluc3RhbmNlIG9mIENvdiwgdG8gYWxsb3cgZm9yIGNoYWluaW5nXG5cdCAqL1xuXHRvZmY6IGZ1bmN0aW9uIG9mZigpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBpZCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YsIGluZGV4LCBhcnIpIHtcblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0Ly8gSWYgbm8gSUQgaXMgcGFzc2VkLCByZW1vdmUgYWxsIGxpc3RlbmVyc1xuXHRcdFx0XHRcdGlmICghaWQpIHtcblx0XHRcdFx0XHRcdGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGp1c3QgcmVtb3ZlIHNwZWNpZmllZCBjYWxsYmFja1xuXHRcdFx0XHRcdFx0Y292LmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNiT2JqLCBpeCwgY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjYk9iai5pZCA9PT0gaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFja3Muc3BsaWNlKGl4LCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ292O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWZpbmVkICovXG5cbnZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJy4vdGhyb3R0bGUnKTtcblxuLyoqXG4gKiBEZWJvdW5jZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRGVib3VuY2luZywgdW5saWtlIHRocm90dGxpbmcsXG4gKiBndWFyYW50ZWVzIHRoYXQgYSBmdW5jdGlvbiBpcyBvbmx5IGV4ZWN1dGVkIGEgc2luZ2xlIHRpbWUsIGVpdGhlciBhdCB0aGVcbiAqIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2VyaWVzIG9mIGNhbGxzLCBvciBhdCB0aGUgdmVyeSBlbmQuXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSAgIGRlbGF5ICAgICAgICAgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnQgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgYXRCZWdpbiAgICAgICBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIGF0QmVnaW4gaXMgZmFsc2Ugb3IgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgb25seSBiZSBleGVjdXRlZCBgZGVsYXlgIG1pbGxpc2Vjb25kc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgdGhlIGxhc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuIElmIGF0QmVnaW4gaXMgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmx5IGF0IHRoZSBmaXJzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChBZnRlciB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGhhcyBub3QgYmVlbiBjYWxsZWQgZm9yIGBkZWxheWAgbWlsbGlzZWNvbmRzLCB0aGUgaW50ZXJuYWwgY291bnRlciBpcyByZXNldCkuXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgICAgICBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy4gVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBgY2FsbGJhY2tgIHdoZW4gdGhlIGRlYm91bmNlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcsIGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIGRlbGF5LCBhdEJlZ2luLCBjYWxsYmFjayApIHtcblx0cmV0dXJuIGNhbGxiYWNrID09PSB1bmRlZmluZWQgPyB0aHJvdHRsZShkZWxheSwgYXRCZWdpbiwgZmFsc2UpIDogdGhyb3R0bGUoZGVsYXksIGNhbGxiYWNrLCBhdEJlZ2luICE9PSBmYWxzZSk7XG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWZpbmVkLG5vLXBhcmFtLXJlYXNzaWduLG5vLXNoYWRvdyAqL1xuXG4vKipcbiAqIFRocm90dGxlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgcmF0ZSBsaW1pdGluZ1xuICogZXhlY3V0aW9uIG9mIGhhbmRsZXJzIG9uIGV2ZW50cyBsaWtlIHJlc2l6ZSBhbmQgc2Nyb2xsLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gICAgZGVsYXkgICAgICAgICAgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnQgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgIG5vVHJhaWxpbmcgICAgIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgbm9UcmFpbGluZyBpcyB0cnVlLCBjYWxsYmFjayB3aWxsIG9ubHkgZXhlY3V0ZSBldmVyeSBgZGVsYXlgIG1pbGxpc2Vjb25kcyB3aGlsZSB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZC4gSWYgbm9UcmFpbGluZyBpcyBmYWxzZSBvciB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmUgZmluYWwgdGltZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlciB0aGUgbGFzdCB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICogQHBhcmFtICB7RnVuY3Rpb259ICBjYWxsYmFjayAgICAgICBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy4gVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGBjYWxsYmFja2Agd2hlbiB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICogQHBhcmFtICB7Qm9vbGVhbn0gICBkZWJvdW5jZU1vZGUgICBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLiBJZiBgZGVib3VuY2VNb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259ICBBIG5ldywgdGhyb3R0bGVkLCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIGRlbGF5LCBub1RyYWlsaW5nLCBjYWxsYmFjaywgZGVib3VuY2VNb2RlICkge1xuXG5cdC8vIEFmdGVyIHdyYXBwZXIgaGFzIHN0b3BwZWQgYmVpbmcgY2FsbGVkLCB0aGlzIHRpbWVvdXQgZW5zdXJlcyB0aGF0XG5cdC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxuXHQvLyBkZWJvdW5jZSBtb2Rlcy5cblx0dmFyIHRpbWVvdXRJRDtcblxuXHQvLyBLZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHRpbWUgYGNhbGxiYWNrYCB3YXMgZXhlY3V0ZWQuXG5cdHZhciBsYXN0RXhlYyA9IDA7XG5cblx0Ly8gYG5vVHJhaWxpbmdgIGRlZmF1bHRzIHRvIGZhbHN5LlxuXHRpZiAoIHR5cGVvZiBub1RyYWlsaW5nICE9PSAnYm9vbGVhbicgKSB7XG5cdFx0ZGVib3VuY2VNb2RlID0gY2FsbGJhY2s7XG5cdFx0Y2FsbGJhY2sgPSBub1RyYWlsaW5nO1xuXHRcdG5vVHJhaWxpbmcgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyBUaGUgYHdyYXBwZXJgIGZ1bmN0aW9uIGVuY2Fwc3VsYXRlcyBhbGwgb2YgdGhlIHRocm90dGxpbmcgLyBkZWJvdW5jaW5nXG5cdC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXG5cdC8vIGlzIGV4ZWN1dGVkLlxuXHRmdW5jdGlvbiB3cmFwcGVyICgpIHtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgZWxhcHNlZCA9IE51bWJlcihuZXcgRGF0ZSgpKSAtIGxhc3RFeGVjO1xuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG5cdFx0Ly8gRXhlY3V0ZSBgY2FsbGJhY2tgIGFuZCB1cGRhdGUgdGhlIGBsYXN0RXhlY2AgdGltZXN0YW1wLlxuXHRcdGZ1bmN0aW9uIGV4ZWMgKCkge1xuXHRcdFx0bGFzdEV4ZWMgPSBOdW1iZXIobmV3IERhdGUoKSk7XG5cdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbikgdGhpcyBpcyB1c2VkIHRvIGNsZWFyIHRoZSBmbGFnXG5cdFx0Ly8gdG8gYWxsb3cgZnV0dXJlIGBjYWxsYmFja2AgZXhlY3V0aW9ucy5cblx0XHRmdW5jdGlvbiBjbGVhciAoKSB7XG5cdFx0XHR0aW1lb3V0SUQgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBkZWJvdW5jZU1vZGUgJiYgIXRpbWVvdXRJRCApIHtcblx0XHRcdC8vIFNpbmNlIGB3cmFwcGVyYCBpcyBiZWluZyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGFuZFxuXHRcdFx0Ly8gYGRlYm91bmNlTW9kZWAgaXMgdHJ1ZSAoYXQgYmVnaW4pLCBleGVjdXRlIGBjYWxsYmFja2AuXG5cdFx0XHRleGVjKCk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuXG5cdFx0aWYgKCB0aW1lb3V0SUQgKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dElEKTtcblx0XHR9XG5cblx0XHRpZiAoIGRlYm91bmNlTW9kZSA9PT0gdW5kZWZpbmVkICYmIGVsYXBzZWQgPiBkZWxheSApIHtcblx0XHRcdC8vIEluIHRocm90dGxlIG1vZGUsIGlmIGBkZWxheWAgdGltZSBoYXMgYmVlbiBleGNlZWRlZCwgZXhlY3V0ZVxuXHRcdFx0Ly8gYGNhbGxiYWNrYC5cblx0XHRcdGV4ZWMoKTtcblxuXHRcdH0gZWxzZSBpZiAoIG5vVHJhaWxpbmcgIT09IHRydWUgKSB7XG5cdFx0XHQvLyBJbiB0cmFpbGluZyB0aHJvdHRsZSBtb2RlLCBzaW5jZSBgZGVsYXlgIHRpbWUgaGFzIG5vdCBiZWVuXG5cdFx0XHQvLyBleGNlZWRlZCwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGBkZWxheWAgbXMgYWZ0ZXIgbW9zdFxuXHRcdFx0Ly8gcmVjZW50IGV4ZWN1dGlvbi5cblx0XHRcdC8vXG5cdFx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZVxuXHRcdFx0Ly8gYWZ0ZXIgYGRlbGF5YCBtcy5cblx0XHRcdC8vXG5cdFx0XHQvLyBJZiBgZGVib3VuY2VNb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0b1xuXHRcdFx0Ly8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLlxuXHRcdFx0dGltZW91dElEID0gc2V0VGltZW91dChkZWJvdW5jZU1vZGUgPyBjbGVhciA6IGV4ZWMsIGRlYm91bmNlTW9kZSA9PT0gdW5kZWZpbmVkID8gZGVsYXkgLSBlbGFwc2VkIDogZGVsYXkpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuXHRyZXR1cm4gd3JhcHBlcjtcblxufTtcbiIsIlxuIC8qIVxuICogV2luZG93RXZlbnRzLmpzXG4gKiBAYXV0aG9yIFBldGUgRHJvbGwgPGRyb2xsLnBAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmltcG9ydCBwdWJsaXNoZXIgZnJvbSAnY292anMnO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ3Rocm90dGxlLWRlYm91bmNlL2RlYm91bmNlJztcbmltcG9ydCB0aHJvdHRsZSBmcm9tICd0aHJvdHRsZS1kZWJvdW5jZS90aHJvdHRsZSc7XG5pbXBvcnQgU2Nyb2xsRXZlbnRzIGZyb20gJy4vc2Nyb2xsJztcbmltcG9ydCBSZXNpemVFdmVudHMgZnJvbSAnLi9yZXNpemUnO1xuaW1wb3J0IFZpc2liaWxpdHlFdmVudHMgZnJvbSAnLi92aXNpYmlsaXR5JztcblxuY2xhc3MgV2luZG93RXZlbnRzIHtcblxuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBzY3JvbGxEZWxheTogMTAwLFxuICAgICAgcmVzaXplRGVsYXk6IDM1MCxcbiAgICB9O1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0cyA/IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdHMgfSA6IGRlZmF1bHRPcHRpb25zO1xuICAgIHRoaXMub24gPSBwdWJsaXNoZXIub247XG4gICAgdGhpcy5vbmNlID0gcHVibGlzaGVyLm9uY2U7XG4gICAgdGhpcy5vZmYgPSBwdWJsaXNoZXIub2ZmO1xuXG4gICAgY29uc3QgcmVzaXplRXZlbnRzID0gbmV3IFJlc2l6ZUV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucyk7XG4gICAgLy8gUGFzcyByZXNpemVFdmVudHMgb2JqZWN0IHRvIHNjcm9sbCBsaXN0ZW5lclxuICAgIC8vIGluIG9yZGVyIHRvIGhhdmUgYWNjZXNzIHRvIHdpbmRvdyBoZWlnaHQsIHdpZHRoXG4gICAgY29uc3Qgc2Nyb2xsRXZlbnRzID0gbmV3IFNjcm9sbEV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucywgcmVzaXplRXZlbnRzKTtcbiAgICBjb25zdCB2aXNpYmlsaXR5RXZlbnRzID0gbmV3IFZpc2liaWxpdHlFdmVudHMocHVibGlzaGVyLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlKFxuICAgICAgLy8gRGVsYXlcbiAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxEZWxheSxcbiAgICAgIC8vIEF0IGJlZ2lubmluZ1xuICAgICAgdHJ1ZSxcbiAgICAgIC8vIERlYm91bmNlZCBmdW5jdGlvblxuICAgICAgc2Nyb2xsRXZlbnRzLmRlYm91bmNlZExpc3RlbmVyLFxuICAgICkpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aHJvdHRsZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXksXG4gICAgICAvLyBObyBUcmFpbGluZy4gSWYgZmFsc2UsIHdpbGwgZ2V0IGNhbGxlZCBvbmUgbGFzdCB0aW1lIGFmdGVyIHRoZSBsYXN0IHRocm90dGxlZCBjYWxsXG4gICAgICBmYWxzZSxcbiAgICAgIC8vIFRocm90dGxlZCBmdW5jdGlvblxuICAgICAgc2Nyb2xsRXZlbnRzLnRocm90dGxlZExpc3RlbmVyLFxuICAgICkpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkZWJvdW5jZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMucmVzaXplRGVsYXksXG4gICAgICAvLyBBdCBiZWdpbm5pbmdcbiAgICAgIHRydWUsXG4gICAgICAvLyBEZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgIHJlc2l6ZUV2ZW50cy5kZWJvdW5jZWRMaXN0ZW5lcixcbiAgICApKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhyb3R0bGUoXG4gICAgICAvLyBEZWxheVxuICAgICAgdGhpcy5vcHRpb25zLnJlc2l6ZURlbGF5LFxuICAgICAgLy8gTm8gVHJhaWxpbmcuIElmIGZhbHNlLCB3aWxsIGdldCBjYWxsZWQgb25lIGxhc3QgdGltZSBhZnRlciB0aGUgbGFzdCB0aHJvdHRsZWQgY2FsbFxuICAgICAgZmFsc2UsXG4gICAgICAvLyBUaHJvdHRsZWQgZnVuY3Rpb25cbiAgICAgIHJlc2l6ZUV2ZW50cy50aHJvdHRsZWRMaXN0ZW5lcixcbiAgICApKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgdmlzaWJpbGl0eUV2ZW50cy5jaGFuZ2VMaXN0ZW50ZXIpO1xuXG4gICAgdGhpcy5nZXRTdGF0ZSA9ICgpID0+ICh7XG4gICAgICAuLi5yZXNpemVFdmVudHMuZ2V0U3RhdGUoKSxcbiAgICAgIC4uLnNjcm9sbEV2ZW50cy5nZXRTdGF0ZSgpLFxuICAgICAgLi4udmlzaWJpbGl0eUV2ZW50cy5nZXRTdGF0ZSgpLFxuICAgIH0pO1xuXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9ICgpID0+IHtcbiAgICAgIHJlc2l6ZUV2ZW50cy51cGRhdGVTdGF0ZSgpO1xuICAgICAgc2Nyb2xsRXZlbnRzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICB2aXNpYmlsaXR5RXZlbnRzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSgpO1xuICAgIH07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dFdmVudHM7XG4iLCJjbGFzcyBSZXNpemVFdmVudHMge1xuICBjb25zdHJ1Y3RvcihwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSBudWxsO1xuXG4gICAgdGhpcy5kZWJvdW5jZWRMaXN0ZW5lciA9IHRoaXMuZGVib3VuY2VkTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRocm90dGxlZExpc3RlbmVyID0gdGhpcy50aHJvdHRsZWRMaXN0ZW5lci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmxhc3RIID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSB0aGlzLmxhc3RXID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSB0aGlzLmxhc3RTID0gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMubGFzdE8gPSB0aGlzLmhlaWdodCA+IHRoaXMud2lkdGggPyAncG9ydHJhaXQnIDogJ2xhbmRzY2FwZSc7XG4gIH1cblxuICBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgc2Nyb2xsSGVpZ2h0OiB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uLFxuICAgIH07XG4gIH1cblxuICBkZWJvdW5jZWRMaXN0ZW5lcigpIHtcbiAgICB0aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodDtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnO1xuXG4gICAgY29uc3Qgc2l6ZU9iaiA9IHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvbixcbiAgICB9O1xuXG4gICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zdGFydCcsIFtzaXplT2JqXSk7XG5cbiAgICB0aGlzLmxhc3RIID0gdGhpcy5oZWlnaHQ7XG4gICAgdGhpcy5sYXN0VyA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0O1xuICB9XG5cbiAgdGhyb3R0bGVkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMuaGVpZ2h0ID4gdGhpcy53aWR0aCA/ICdwb3J0cmFpdCcgOiAnbGFuZHNjYXBlJztcblxuICAgIGNvbnN0IHNpemVPYmogPSB7XG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBzY3JvbGxIZWlnaHQ6IHRoaXMuc2Nyb2xsSGVpZ2h0LFxuICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb24sXG4gICAgfTtcblxuICAgIHRoaXMuc2lnbmFsKCdyZXNpemUnLCBbc2l6ZU9ial0pO1xuXG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24gIT09IHRoaXMubGFzdE8pIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdyZXNpemUub3JpZW50YXRpb25DaGFuZ2UnLCBbc2l6ZU9ial0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCAhPT0gdGhpcy5sYXN0Uykge1xuICAgICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zY3JvbGxIZWlnaHRDaGFuZ2UnLCBbc2l6ZU9ial0pO1xuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpO1xuICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zaWduYWwoJ3Jlc2l6ZS5zdG9wJywgW3NpemVPYmpdKTtcbiAgICB9LCB0aGlzLm9wdGlvbnMucmVzaXplRGVsYXkgKyAxKTtcblxuICAgIHRoaXMubGFzdEggPSB0aGlzLmhlaWdodDtcbiAgICB0aGlzLmxhc3RXID0gdGhpcy53aWR0aDtcbiAgICB0aGlzLmxhc3RTID0gdGhpcy5zY3JvbGxIZWlnaHQ7XG4gICAgdGhpcy5sYXN0TyA9IHRoaXMub3JpZW50YXRpb247XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzaXplRXZlbnRzO1xuIiwiY2xhc3MgU2Nyb2xsRXZlbnRzIHtcbiAgY29uc3RydWN0b3IocHVibGlzaGVyLCBvcHRpb25zLCBzaXplUmVmKSB7XG4gICAgdGhpcy5zaWduYWwgPSBwdWJsaXNoZXIuc2lnbmFsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy53aW5kb3dTaXplID0gc2l6ZVJlZjtcbiAgICB0aGlzLnNjcm9sbFRpbWVvdXQgPSBudWxsO1xuXG4gICAgdGhpcy5kZWJvdW5jZWRMaXN0ZW5lciA9IHRoaXMuZGVib3VuY2VkTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRocm90dGxlZExpc3RlbmVyID0gdGhpcy50aHJvdHRsZWRMaXN0ZW5lci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSB0aGlzLmxhc3RTY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgdGhpcy5zY3JvbGxQZXJjZW50ID1cbiAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIC8gKHRoaXMud2luZG93U2l6ZS5zY3JvbGxIZWlnaHQgLSB0aGlzLndpbmRvd1NpemUuaGVpZ2h0KSkgKiAxMDA7XG4gIH1cblxuICBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbFRvcCxcbiAgICAgIHNjcm9sbFBlcmNlbnQ6IHRoaXMuc2Nyb2xsUGVyY2VudCxcbiAgICB9O1xuICB9XG5cbiAgZGVib3VuY2VkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgdGhpcy5zY3JvbGxQZXJjZW50ID1cbiAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIC8gKHRoaXMud2luZG93U2l6ZS5zY3JvbGxIZWlnaHQgLSB0aGlzLndpbmRvd1NpemUuaGVpZ2h0KSkgKiAxMDA7XG5cbiAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLnN0YXJ0JywgW3tcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnQsXG4gICAgfV0pO1xuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3A7XG4gIH1cblxuICB0aHJvdHRsZWRMaXN0ZW5lcigpIHtcbiAgICB0aGlzLnNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICB0aGlzLnNjcm9sbFBlcmNlbnQgPVxuICAgICAgICAodGhpcy5zY3JvbGxUb3AgLyAodGhpcy53aW5kb3dTaXplLnNjcm9sbEhlaWdodCAtIHRoaXMud2luZG93U2l6ZS5oZWlnaHQpKSAqIDEwMDtcblxuICAgIGNvbnN0IHNjcm9sbE9iaiA9IHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnQsXG4gICAgfTtcblxuICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwnLCBbc2Nyb2xsT2JqXSk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxUb3AgPiB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwuZG93bicsIFtzY3JvbGxPYmpdKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2Nyb2xsVG9wIDwgdGhpcy5sYXN0U2Nyb2xsVG9wKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLnVwJywgW3Njcm9sbE9ial0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjcm9sbFRvcCA8PSAwKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLnRvcCcsIFtzY3JvbGxPYmpdKTtcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsT2JqLnNjcm9sbFBlcmNlbnQgPj0gMTAwKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLmJvdHRvbScsIFtzY3JvbGxPYmpdKTtcbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5zY3JvbGxUaW1lb3V0KTtcbiAgICB0aGlzLnNjcm9sbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2lnbmFsKCdzY3JvbGwuc3RvcCcsIFtzY3JvbGxPYmpdKTtcbiAgICB9LCB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXkgKyAxKTtcblxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRoaXMuc2Nyb2xsVG9wO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjcm9sbEV2ZW50cztcbiIsImNsYXNzIFZpc2liaWxpdHlFdmVudHMge1xuICBjb25zdHJ1Y3RvcihwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuY2hhbmdlTGlzdGVudGVyID0gdGhpcy5jaGFuZ2VMaXN0ZW50ZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKCkge1xuICAgIHRoaXMudmlzaWJsZSA9ICFkb2N1bWVudC5oaWRkZW47XG4gIH1cblxuICBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmlzaWJsZTogdGhpcy52aXNpYmxlLFxuICAgIH07XG4gIH1cblxuICBjaGFuZ2VMaXN0ZW50ZXIoKSB7XG4gICAgdGhpcy52aXNpYmxlID0gIWRvY3VtZW50LmhpZGRlbjtcblxuICAgIGNvbnN0IHZpc2libGVPYmogPSB7XG4gICAgICB2aXNpYmxlOiB0aGlzLnZpc2libGUsXG4gICAgfTtcblxuICAgIHRoaXMuc2lnbmFsKCd2aXNpYmlsaXR5Q2hhbmdlJywgW3Zpc2libGVPYmpdKTtcblxuICAgIGlmICh0aGlzLnZpc2libGUpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCd2aXNpYmlsaXR5Q2hhbmdlLnNob3cnLCBbdmlzaWJsZU9ial0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNpZ25hbCgndmlzaWJpbGl0eUNoYW5nZS5oaWRlJywgW3Zpc2libGVPYmpdKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlzaWJpbGl0eUV2ZW50cztcbiJdfQ==
