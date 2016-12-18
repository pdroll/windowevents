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

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

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
  var loadEvents = new _load2.default(_covjs2.default, this.options);

  this.getState = function () {
    return _extends({}, resizeEvents.getState(), scrollEvents.getState(), visibilityEvents.getState(), loadEvents.getState());
  };

  this.updateState = function () {
    resizeEvents.updateState();
    scrollEvents.updateState();
    visibilityEvents.updateState();
    loadEvents.updateState();
    return _this.getState();
  };

  window.addEventListener('scroll', (0, _debounce2.default)(
  // Delay
  this.options.scrollDelay,
  // At beginning
  true,
  // Debounced function
  scrollEvents.debouncedListener), false);
  window.addEventListener('scroll', (0, _throttle2.default)(
  // Delay
  this.options.scrollDelay,
  // No Trailing. If false, will get called one last time after the last throttled call
  false,
  // Throttled function
  scrollEvents.throttledListener), false);
  window.addEventListener('resize', (0, _debounce2.default)(
  // Delay
  this.options.resizeDelay,
  // At beginning
  true,
  // Debounced function
  resizeEvents.debouncedListener), false);
  window.addEventListener('resize', (0, _throttle2.default)(
  // Delay
  this.options.resizeDelay,
  // No Trailing. If false, will get called one last time after the last throttled call
  false,
  // Throttled function
  resizeEvents.throttledListener), false);

  window.addEventListener('visibilitychange', visibilityEvents.changeListenter, false);

  document.addEventListener('readystatechange', function () {
    // Update the state once all
    // images and resources have loaded
    _this.updateState();
    loadEvents.changeListenter();
  }, false);
};

module.exports = WindowEvents;

},{"./load":5,"./resize":6,"./scroll":7,"./visibility":8,"covjs":1,"throttle-debounce/debounce":2,"throttle-debounce/throttle":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoadEvents = function () {
  function LoadEvents(publisher, options) {
    _classCallCheck(this, LoadEvents);

    this.signal = publisher.signal;
    this.options = options;

    this.changeListenter = this.changeListenter.bind(this);

    this.updateState();
  }

  _createClass(LoadEvents, [{
    key: 'updateState',
    value: function updateState() {
      this.loaded = document.readyState;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return {
        loaded: this.loaded
      };
    }
  }, {
    key: 'changeListenter',
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

exports.default = LoadEvents;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY292anMvY292LmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL3Rocm90dGxlLWRlYm91bmNlL3Rocm90dGxlLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2xvYWQuanMiLCJzcmMvcmVzaXplLmpzIiwic3JjL3Njcm9sbC5qcyIsInNyYy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDckZBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7O0FBWEM7Ozs7Ozs7SUFhSyxZLEdBRUosc0JBQVksSUFBWixFQUFrQjtBQUFBOztBQUFBOztBQUNoQixN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QUMsU0FBRCxDQUE3QjtBQUNEOztBQUVELG1CQUFhLEtBQUssYUFBbEI7QUFDQSxXQUFLLGFBQUwsR0FBcUIsV0FBVyxZQUFNO0FBQ3BDLGNBQUssTUFBTCxDQUFZLGFBQVosRUFBMkIsQ0FBQyxTQUFELENBQTNCO0FBQ0QsT0FGb0IsRUFFbEIsS0FBSyxPQUFMLENBQWEsV0FBYixHQUEyQixDQUZULENBQXJCOztBQUlBLFdBQUssYUFBTCxHQUFxQixLQUFLLFNBQTFCO0FBQ0Q7Ozs7OztrQkFHWSxZOzs7Ozs7Ozs7Ozs7O0lDMUVULGdCO0FBQ0osNEJBQVksU0FBWixFQUF1QixPQUF2QixFQUFnQztBQUFBOztBQUM5QixTQUFLLE1BQUwsR0FBYyxVQUFVLE1BQXhCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBZjs7QUFFQSxTQUFLLGVBQUwsR0FBdUIsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXZCOztBQUVBLFNBQUssV0FBTDtBQUNEOzs7O2tDQUVhO0FBQ1osV0FBSyxPQUFMLEdBQWUsQ0FBQyxTQUFTLE1BQXpCO0FBQ0Q7OzsrQkFFVTtBQUNULGFBQU87QUFDTCxpQkFBUyxLQUFLO0FBRFQsT0FBUDtBQUdEOzs7c0NBRWlCO0FBQ2hCLFdBQUssT0FBTCxHQUFlLENBQUMsU0FBUyxNQUF6Qjs7QUFFQSxVQUFNLGFBQWE7QUFDakIsaUJBQVMsS0FBSztBQURHLE9BQW5COztBQUlBLFdBQUssTUFBTCxDQUFZLGtCQUFaLEVBQWdDLENBQUMsVUFBRCxDQUFoQzs7QUFFQSxVQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixhQUFLLE1BQUwsQ0FBWSx1QkFBWixFQUFxQyxDQUFDLFVBQUQsQ0FBckM7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLLE1BQUwsQ0FBWSx1QkFBWixFQUFxQyxDQUFDLFVBQUQsQ0FBckM7QUFDRDtBQUNGOzs7Ozs7a0JBR1ksZ0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBAYXV0aG9yIERhdmUgRGV2b3IgPGRhdmVkZXZvckBnbWFpbC5jb20+XG4gKi9cblxuLyoqXG4gKiBDaGVja3MgaWYgYSB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAqXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gX2lzRm4oZm4pIHtcblx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmbikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogU3RvcmUgaW5jcmVtZW50aW5nIElEIGZvciBlYWNoIHBhc3NlZCBjYWxsYmFja1xuICogQHR5cGUgIHtJbnR9XG4gKi9cbnZhciBjYWxsYmFja0lkID0gMDtcblxuLyoqXG4gKiBTdG9yZSBhbGwgb2Ygb3VyIGNvdmVuYW50c1xuICogQHR5cGUgIHtBcnJheX1cbiAqL1xudmFyIGNvdmVuYW50cyA9IFtdO1xuXG4vKipcbiAqIE9uZSBvYmplY3QgdG8gaG9sZCBhbGwgb2YgdGhlIGFwcHMgY292ZW5hbnRzLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIENvdiA9IHtcblxuXHQvKipcblx0ICogUmVnaXN0ZXIgYW4gZXZlbnQsIG9yIGFkZCB0byBhbiBleGlzdGluZyBldmVudFxuXHQgKiBAcGFyYW0gICB7U3RyaW5nfSAgbmFtZSAgICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJ1xuXHQgKiBAcGFyYW0gICB7RnVuY3Rpb259ICBmbiAgICBUaGUgY2xvc3VyZSB0byBleGVjdXRlIHdoZW4gc2lnbmFsZWQuXG5cdCAqIEByZXR1cm4gIHtNaXhlZH0gICAgICAgICAgIFVuaXF1ZSBJRCBmb3IgbGlzdGVuZXIgb3IgZmFsc2Ugb24gaW5jb3JyZWN0IHBhcmFtZXRlcnNcblx0ICovXG5cdG9uOiBmdW5jdGlvbiBvbigpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBmbiA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoZSBmbiBpcyBhIGZ1bmN0aW9uXG5cdFx0dmFyIGlzRm4gPSBfaXNGbihmbik7XG5cblx0XHRpZiAobmFtZSAmJiBmbiAmJiBpc0ZuKSB7XG5cdFx0XHR2YXIgX2V4aXN0cyA9IGZhbHNlO1xuXHRcdFx0dmFyIGNiT2JqID0ge1xuXHRcdFx0XHRpZDogJ2Nvdl8nICsgKCsrY2FsbGJhY2tJZCksXG5cdFx0XHRcdGZuOiBmblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjaGVjayBpZiB0aGlzIGV2ZW4gZXhpc3RzXG5cdFx0XHRjb3ZlbmFudHMuZm9yRWFjaChmdW5jdGlvbiAoY292KSB7XG5cdFx0XHRcdC8vIElmIGl0IGFscmVhZHkgZXhpc3RzLCBhZGQgdGhlIGZ1bmN0aW9uIHRvIGl0cyBmdW5jdGlvbnMuXG5cdFx0XHRcdGlmIChjb3YubmFtZSA9PT0gbmFtZSkge1xuXHRcdFx0XHRcdGNvdi5jYWxsYmFja3MucHVzaChjYk9iaik7XG5cdFx0XHRcdFx0X2V4aXN0cyA9IHRydWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gSWYgaXQgZG9lc250IGV4aXN0IGNyZWF0ZSBpdC5cblx0XHRcdGlmICghX2V4aXN0cykge1xuXHRcdFx0XHR2YXIgbmV3Q292ZW5hbnQgPSB7XG5cdFx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0XHRjYWxsYmFja3M6IFtjYk9ial1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRjb3ZlbmFudHMucHVzaChuZXdDb3ZlbmFudCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2JPYmouaWQ7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBhbiBldmVudCB0byBmaXJlIG9ubHkgb25jZVxuXHQgKiBAcGFyYW0gICB7U3RyaW5nfSAgbmFtZSAgICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJ1xuXHQgKiBAcGFyYW0gICB7RnVuY3Rpb259ICBmbiAgICBUaGUgY2xvc3VyZSB0byBleGVjdXRlIHdoZW4gc2lnbmFsZWQuXG5cdCAqIEByZXR1cm4gIHtNaXhlZH0gICAgICAgICAgIFVuaXF1ZSBJRCBmb3IgbGlzdGVuZXIgb3IgZmFsc2Ugb24gaW5jb3JyZWN0IHBhcmFtZXRlcnNcblx0ICovXG5cdG9uY2U6IGZ1bmN0aW9uIG9uY2UoKSB7XG5cdFx0dmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1swXTtcblx0XHR2YXIgZm4gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdHZhciBuZXdJZCA9ICdjb3ZfJyArIChjYWxsYmFja0lkICsgMSk7XG5cdFx0dmFyIG9uZVRpbWVGdW5jID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRmbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuXHRcdFx0dGhpcy5vZmYobmFtZSwgbmV3SWQpO1xuXHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdHRoaXMub24obmFtZSwgb25lVGltZUZ1bmMpO1xuXG5cdFx0cmV0dXJuIG5ld0lkO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIFNpZ25hbCBhbiBldmVudCBhbmQgcnVuIGFsbCBvZiBpdHMgc3Vic2NyaWJlZCBmdW5jdGlvbnMuXG5cdCAqIEBwYXJhbSAge1N0cmluZ30gICAgbmFtZSAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCc7XG5cdCAqIEBwYXJhbSAge29iamVjdFtdfSAgYXJncyAgQW55IGFyZ3VtZW50cyB0aGF0IG5lZWQgdG8gYmUgc2VudCB0byB0aGUgIGZuXG5cdCAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgQ3VycmVudCBpbnN0YW5jZSBvZiBDb3YsIHRvIGFsbG93IGZvciBjaGFpbmluZ1xuXHQgKi9cblx0c2lnbmFsOiBmdW5jdGlvbiBzaWduYWwoKSB7XG5cdFx0dmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1swXTtcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzFdO1xuXG5cblx0XHRpZiAobmFtZSkge1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdikge1xuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblxuXHRcdFx0XHRcdGNvdi5jYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2JPYmopIHtcblx0XHRcdFx0XHRcdGNiT2JqLmZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBVbnJlZ2lzdGVyICh0dXJuIG9mZikgYW4gZXZlbnQuXG5cdCAqIEBwYXJhbSAge1N0cmluZ30gIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnO1xuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICBJRCBvZiBsaXN0ZW5lciBhcyByZXR1cm5lZCBieSBgb25gIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm4ge29iamVjdH0gIEN1cnJlbnQgaW5zdGFuY2Ugb2YgQ292LCB0byBhbGxvdyBmb3IgY2hhaW5pbmdcblx0ICovXG5cdG9mZjogZnVuY3Rpb24gb2ZmKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGlkID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHRpZiAobmFtZSkge1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdiwgaW5kZXgsIGFycikge1xuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblx0XHRcdFx0XHQvLyBJZiBubyBJRCBpcyBwYXNzZWQsIHJlbW92ZSBhbGwgbGlzdGVuZXJzXG5cdFx0XHRcdFx0aWYgKCFpZCkge1xuXHRcdFx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBPdGhlcndpc2UganVzdCByZW1vdmUgc3BlY2lmaWVkIGNhbGxiYWNrXG5cdFx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2JPYmosIGl4LCBjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGNiT2JqLmlkID09PSBpZCkge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5zcGxpY2UoaXgsIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb3Y7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZmluZWQgKi9cblxudmFyIHRocm90dGxlID0gcmVxdWlyZSgnLi90aHJvdHRsZScpO1xuXG4vKipcbiAqIERlYm91bmNlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBEZWJvdW5jaW5nLCB1bmxpa2UgdGhyb3R0bGluZyxcbiAqIGd1YXJhbnRlZXMgdGhhdCBhIGZ1bmN0aW9uIGlzIG9ubHkgZXhlY3V0ZWQgYSBzaW5nbGUgdGltZSwgZWl0aGVyIGF0IHRoZVxuICogdmVyeSBiZWdpbm5pbmcgb2YgYSBzZXJpZXMgb2YgY2FsbHMsIG9yIGF0IHRoZSB2ZXJ5IGVuZC5cbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgZGVsYXkgICAgICAgICBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudCBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAqIEBwYXJhbSAge0Jvb2xlYW59ICBhdEJlZ2luICAgICAgIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgYXRCZWdpbiBpcyBmYWxzZSBvciB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGBkZWxheWAgbWlsbGlzZWNvbmRzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlciB0aGUgbGFzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gSWYgYXRCZWdpbiBpcyB0cnVlLCBjYWxsYmFjayB3aWxsIGJlIGV4ZWN1dGVkIG9ubHkgYXQgdGhlIGZpcnN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KS5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayAgICAgIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLiBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGBjYWxsYmFja2Agd2hlbiB0aGUgZGVib3VuY2VkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldywgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggZGVsYXksIGF0QmVnaW4sIGNhbGxiYWNrICkge1xuXHRyZXR1cm4gY2FsbGJhY2sgPT09IHVuZGVmaW5lZCA/IHRocm90dGxlKGRlbGF5LCBhdEJlZ2luLCBmYWxzZSkgOiB0aHJvdHRsZShkZWxheSwgY2FsbGJhY2ssIGF0QmVnaW4gIT09IGZhbHNlKTtcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZmluZWQsbm8tcGFyYW0tcmVhc3NpZ24sbm8tc2hhZG93ICovXG5cbi8qKlxuICogVGhyb3R0bGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIEVzcGVjaWFsbHkgdXNlZnVsIGZvciByYXRlIGxpbWl0aW5nXG4gKiBleGVjdXRpb24gb2YgaGFuZGxlcnMgb24gZXZlbnRzIGxpa2UgcmVzaXplIGFuZCBzY3JvbGwuXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSAgICBkZWxheSAgICAgICAgICBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudCBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgbm9UcmFpbGluZyAgICAgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBub1RyYWlsaW5nIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgb25seSBleGVjdXRlIGV2ZXJ5IGBkZWxheWAgbWlsbGlzZWNvbmRzIHdoaWxlIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkLiBJZiBub1RyYWlsaW5nIGlzIGZhbHNlIG9yIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIGJlIGV4ZWN1dGVkIG9uZSBmaW5hbCB0aW1lXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyIHRoZSBsYXN0IHRocm90dGxlZC1mdW5jdGlvbiBjYWxsLiAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gIGNhbGxiYWNrICAgICAgIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLiBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYGNhbGxiYWNrYCB3aGVuIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgIGRlYm91bmNlTW9kZSAgIElmIGBkZWJvdW5jZU1vZGVgIGlzIHRydWUgKGF0IGJlZ2luKSwgc2NoZWR1bGUgYGNsZWFyYCB0byBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuIElmIGBkZWJvdW5jZU1vZGVgIGlzIGZhbHNlIChhdCBlbmQpLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvIGV4ZWN1dGUgYWZ0ZXIgYGRlbGF5YCBtcy5cbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gIEEgbmV3LCB0aHJvdHRsZWQsIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggZGVsYXksIG5vVHJhaWxpbmcsIGNhbGxiYWNrLCBkZWJvdW5jZU1vZGUgKSB7XG5cblx0Ly8gQWZ0ZXIgd3JhcHBlciBoYXMgc3RvcHBlZCBiZWluZyBjYWxsZWQsIHRoaXMgdGltZW91dCBlbnN1cmVzIHRoYXRcblx0Ly8gYGNhbGxiYWNrYCBpcyBleGVjdXRlZCBhdCB0aGUgcHJvcGVyIHRpbWVzIGluIGB0aHJvdHRsZWAgYW5kIGBlbmRgXG5cdC8vIGRlYm91bmNlIG1vZGVzLlxuXHR2YXIgdGltZW91dElEO1xuXG5cdC8vIEtlZXAgdHJhY2sgb2YgdGhlIGxhc3QgdGltZSBgY2FsbGJhY2tgIHdhcyBleGVjdXRlZC5cblx0dmFyIGxhc3RFeGVjID0gMDtcblxuXHQvLyBgbm9UcmFpbGluZ2AgZGVmYXVsdHMgdG8gZmFsc3kuXG5cdGlmICggdHlwZW9mIG5vVHJhaWxpbmcgIT09ICdib29sZWFuJyApIHtcblx0XHRkZWJvdW5jZU1vZGUgPSBjYWxsYmFjaztcblx0XHRjYWxsYmFjayA9IG5vVHJhaWxpbmc7XG5cdFx0bm9UcmFpbGluZyA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8vIFRoZSBgd3JhcHBlcmAgZnVuY3Rpb24gZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgdGhyb3R0bGluZyAvIGRlYm91bmNpbmdcblx0Ly8gZnVuY3Rpb25hbGl0eSBhbmQgd2hlbiBleGVjdXRlZCB3aWxsIGxpbWl0IHRoZSByYXRlIGF0IHdoaWNoIGBjYWxsYmFja2Bcblx0Ly8gaXMgZXhlY3V0ZWQuXG5cdGZ1bmN0aW9uIHdyYXBwZXIgKCkge1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBlbGFwc2VkID0gTnVtYmVyKG5ldyBEYXRlKCkpIC0gbGFzdEV4ZWM7XG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cblx0XHQvLyBFeGVjdXRlIGBjYWxsYmFja2AgYW5kIHVwZGF0ZSB0aGUgYGxhc3RFeGVjYCB0aW1lc3RhbXAuXG5cdFx0ZnVuY3Rpb24gZXhlYyAoKSB7XG5cdFx0XHRsYXN0RXhlYyA9IE51bWJlcihuZXcgRGF0ZSgpKTtcblx0XHRcdGNhbGxiYWNrLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXHRcdH1cblxuXHRcdC8vIElmIGBkZWJvdW5jZU1vZGVgIGlzIHRydWUgKGF0IGJlZ2luKSB0aGlzIGlzIHVzZWQgdG8gY2xlYXIgdGhlIGZsYWdcblx0XHQvLyB0byBhbGxvdyBmdXR1cmUgYGNhbGxiYWNrYCBleGVjdXRpb25zLlxuXHRcdGZ1bmN0aW9uIGNsZWFyICgpIHtcblx0XHRcdHRpbWVvdXRJRCA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRpZiAoIGRlYm91bmNlTW9kZSAmJiAhdGltZW91dElEICkge1xuXHRcdFx0Ly8gU2luY2UgYHdyYXBwZXJgIGlzIGJlaW5nIGNhbGxlZCBmb3IgdGhlIGZpcnN0IHRpbWUgYW5kXG5cdFx0XHQvLyBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIGV4ZWN1dGUgYGNhbGxiYWNrYC5cblx0XHRcdGV4ZWMoKTtcblx0XHR9XG5cblx0XHQvLyBDbGVhciBhbnkgZXhpc3RpbmcgdGltZW91dC5cblx0XHRpZiAoIHRpbWVvdXRJRCApIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0SUQpO1xuXHRcdH1cblxuXHRcdGlmICggZGVib3VuY2VNb2RlID09PSB1bmRlZmluZWQgJiYgZWxhcHNlZCA+IGRlbGF5ICkge1xuXHRcdFx0Ly8gSW4gdGhyb3R0bGUgbW9kZSwgaWYgYGRlbGF5YCB0aW1lIGhhcyBiZWVuIGV4Y2VlZGVkLCBleGVjdXRlXG5cdFx0XHQvLyBgY2FsbGJhY2tgLlxuXHRcdFx0ZXhlYygpO1xuXG5cdFx0fSBlbHNlIGlmICggbm9UcmFpbGluZyAhPT0gdHJ1ZSApIHtcblx0XHRcdC8vIEluIHRyYWlsaW5nIHRocm90dGxlIG1vZGUsIHNpbmNlIGBkZWxheWAgdGltZSBoYXMgbm90IGJlZW5cblx0XHRcdC8vIGV4Y2VlZGVkLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvIGV4ZWN1dGUgYGRlbGF5YCBtcyBhZnRlciBtb3N0XG5cdFx0XHQvLyByZWNlbnQgZXhlY3V0aW9uLlxuXHRcdFx0Ly9cblx0XHRcdC8vIElmIGBkZWJvdW5jZU1vZGVgIGlzIHRydWUgKGF0IGJlZ2luKSwgc2NoZWR1bGUgYGNsZWFyYCB0byBleGVjdXRlXG5cdFx0XHQvLyBhZnRlciBgZGVsYXlgIG1zLlxuXHRcdFx0Ly9cblx0XHRcdC8vIElmIGBkZWJvdW5jZU1vZGVgIGlzIGZhbHNlIChhdCBlbmQpLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvXG5cdFx0XHQvLyBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG5cdFx0XHR0aW1lb3V0SUQgPSBzZXRUaW1lb3V0KGRlYm91bmNlTW9kZSA/IGNsZWFyIDogZXhlYywgZGVib3VuY2VNb2RlID09PSB1bmRlZmluZWQgPyBkZWxheSAtIGVsYXBzZWQgOiBkZWxheSk7XG5cdFx0fVxuXG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIHdyYXBwZXIgZnVuY3Rpb24uXG5cdHJldHVybiB3cmFwcGVyO1xuXG59O1xuIiwiXG4gLyohXG4gKiBXaW5kb3dFdmVudHMuanNcbiAqIEBhdXRob3IgUGV0ZSBEcm9sbCA8ZHJvbGwucEBnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuaW1wb3J0IHB1Ymxpc2hlciBmcm9tICdjb3Zqcyc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAndGhyb3R0bGUtZGVib3VuY2UvZGVib3VuY2UnO1xuaW1wb3J0IHRocm90dGxlIGZyb20gJ3Rocm90dGxlLWRlYm91bmNlL3Rocm90dGxlJztcbmltcG9ydCBTY3JvbGxFdmVudHMgZnJvbSAnLi9zY3JvbGwnO1xuaW1wb3J0IFJlc2l6ZUV2ZW50cyBmcm9tICcuL3Jlc2l6ZSc7XG5pbXBvcnQgVmlzaWJpbGl0eUV2ZW50cyBmcm9tICcuL3Zpc2liaWxpdHknO1xuaW1wb3J0IExvYWRFdmVudHMgZnJvbSAnLi9sb2FkJztcblxuY2xhc3MgV2luZG93RXZlbnRzIHtcblxuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBzY3JvbGxEZWxheTogMTAwLFxuICAgICAgcmVzaXplRGVsYXk6IDM1MCxcbiAgICB9O1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0cyA/IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdHMgfSA6IGRlZmF1bHRPcHRpb25zO1xuICAgIHRoaXMub24gPSBwdWJsaXNoZXIub247XG4gICAgdGhpcy5vbmNlID0gcHVibGlzaGVyLm9uY2U7XG4gICAgdGhpcy5vZmYgPSBwdWJsaXNoZXIub2ZmO1xuXG4gICAgY29uc3QgcmVzaXplRXZlbnRzID0gbmV3IFJlc2l6ZUV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucyk7XG4gICAgLy8gUGFzcyByZXNpemVFdmVudHMgb2JqZWN0IHRvIHNjcm9sbCBsaXN0ZW5lclxuICAgIC8vIGluIG9yZGVyIHRvIGhhdmUgYWNjZXNzIHRvIHdpbmRvdyBoZWlnaHQsIHdpZHRoXG4gICAgY29uc3Qgc2Nyb2xsRXZlbnRzID0gbmV3IFNjcm9sbEV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucywgcmVzaXplRXZlbnRzKTtcbiAgICBjb25zdCB2aXNpYmlsaXR5RXZlbnRzID0gbmV3IFZpc2liaWxpdHlFdmVudHMocHVibGlzaGVyLCB0aGlzLm9wdGlvbnMpO1xuICAgIGNvbnN0IGxvYWRFdmVudHMgPSBuZXcgTG9hZEV2ZW50cyhwdWJsaXNoZXIsIHRoaXMub3B0aW9ucyk7XG5cbiAgICB0aGlzLmdldFN0YXRlID0gKCkgPT4gKHtcbiAgICAgIC4uLnJlc2l6ZUV2ZW50cy5nZXRTdGF0ZSgpLFxuICAgICAgLi4uc2Nyb2xsRXZlbnRzLmdldFN0YXRlKCksXG4gICAgICAuLi52aXNpYmlsaXR5RXZlbnRzLmdldFN0YXRlKCksXG4gICAgICAuLi5sb2FkRXZlbnRzLmdldFN0YXRlKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlID0gKCkgPT4ge1xuICAgICAgcmVzaXplRXZlbnRzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICBzY3JvbGxFdmVudHMudXBkYXRlU3RhdGUoKTtcbiAgICAgIHZpc2liaWxpdHlFdmVudHMudXBkYXRlU3RhdGUoKTtcbiAgICAgIGxvYWRFdmVudHMudXBkYXRlU3RhdGUoKTtcbiAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlKCk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsRGVsYXksXG4gICAgICAvLyBBdCBiZWdpbm5pbmdcbiAgICAgIHRydWUsXG4gICAgICAvLyBEZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgIHNjcm9sbEV2ZW50cy5kZWJvdW5jZWRMaXN0ZW5lcixcbiAgICApLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRocm90dGxlKFxuICAgICAgLy8gRGVsYXlcbiAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxEZWxheSxcbiAgICAgIC8vIE5vIFRyYWlsaW5nLiBJZiBmYWxzZSwgd2lsbCBnZXQgY2FsbGVkIG9uZSBsYXN0IHRpbWUgYWZ0ZXIgdGhlIGxhc3QgdGhyb3R0bGVkIGNhbGxcbiAgICAgIGZhbHNlLFxuICAgICAgLy8gVGhyb3R0bGVkIGZ1bmN0aW9uXG4gICAgICBzY3JvbGxFdmVudHMudGhyb3R0bGVkTGlzdGVuZXIsXG4gICAgKSwgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkZWJvdW5jZShcbiAgICAgIC8vIERlbGF5XG4gICAgICB0aGlzLm9wdGlvbnMucmVzaXplRGVsYXksXG4gICAgICAvLyBBdCBiZWdpbm5pbmdcbiAgICAgIHRydWUsXG4gICAgICAvLyBEZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgIHJlc2l6ZUV2ZW50cy5kZWJvdW5jZWRMaXN0ZW5lcixcbiAgICApLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRocm90dGxlKFxuICAgICAgLy8gRGVsYXlcbiAgICAgIHRoaXMub3B0aW9ucy5yZXNpemVEZWxheSxcbiAgICAgIC8vIE5vIFRyYWlsaW5nLiBJZiBmYWxzZSwgd2lsbCBnZXQgY2FsbGVkIG9uZSBsYXN0IHRpbWUgYWZ0ZXIgdGhlIGxhc3QgdGhyb3R0bGVkIGNhbGxcbiAgICAgIGZhbHNlLFxuICAgICAgLy8gVGhyb3R0bGVkIGZ1bmN0aW9uXG4gICAgICByZXNpemVFdmVudHMudGhyb3R0bGVkTGlzdGVuZXIsXG4gICAgKSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB2aXNpYmlsaXR5RXZlbnRzLmNoYW5nZUxpc3RlbnRlciwgZmFsc2UpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgb25jZSBhbGxcbiAgICAgIC8vIGltYWdlcyBhbmQgcmVzb3VyY2VzIGhhdmUgbG9hZGVkXG4gICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICBsb2FkRXZlbnRzLmNoYW5nZUxpc3RlbnRlcigpO1xuICAgIH0sIGZhbHNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd0V2ZW50cztcbiIsImNsYXNzIExvYWRFdmVudHMge1xuICBjb25zdHJ1Y3RvcihwdWJsaXNoZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNpZ25hbCA9IHB1Ymxpc2hlci5zaWduYWw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuY2hhbmdlTGlzdGVudGVyID0gdGhpcy5jaGFuZ2VMaXN0ZW50ZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKCkge1xuICAgIHRoaXMubG9hZGVkID0gZG9jdW1lbnQucmVhZHlTdGF0ZTtcbiAgfVxuXG4gIGdldFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2FkZWQ6IHRoaXMubG9hZGVkLFxuICAgIH07XG4gIH1cblxuICBjaGFuZ2VMaXN0ZW50ZXIoKSB7XG4gICAgdGhpcy5sb2FkZWQgPSBkb2N1bWVudC5yZWFkeVN0YXRlO1xuXG4gICAgY29uc3QgbG9hZGVkT2JqID0ge1xuICAgICAgbG9hZGVkOiB0aGlzLmxvYWRlZCxcbiAgICB9O1xuXG4gICAgdGhpcy5zaWduYWwoJ2xvYWQnLCBbbG9hZGVkT2JqXSk7XG5cbiAgICBpZiAodGhpcy5sb2FkZWQgPT09ICdpbnRlcmFjdGl2ZScpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdsb2FkLmludGVyYWN0aXZlJywgW2xvYWRlZE9ial0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5sb2FkZWQgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdsb2FkLmNvbXBsZXRlJywgW2xvYWRlZE9ial0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkRXZlbnRzO1xuIiwiY2xhc3MgUmVzaXplRXZlbnRzIHtcbiAgY29uc3RydWN0b3IocHVibGlzaGVyLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zaWduYWwgPSBwdWJsaXNoZXIuc2lnbmFsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gbnVsbDtcblxuICAgIHRoaXMuZGVib3VuY2VkTGlzdGVuZXIgPSB0aGlzLmRlYm91bmNlZExpc3RlbmVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy50aHJvdHRsZWRMaXN0ZW5lciA9IHRoaXMudGhyb3R0bGVkTGlzdGVuZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5sYXN0SCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5sYXN0VyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5sYXN0UyA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLmxhc3RPID0gdGhpcy5oZWlnaHQgPiB0aGlzLndpZHRoID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnO1xuICB9XG5cbiAgZ2V0U3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIHNjcm9sbEhlaWdodDogdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvbixcbiAgICB9O1xuICB9XG5cbiAgZGVib3VuY2VkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMuaGVpZ2h0ID4gdGhpcy53aWR0aCA/ICdwb3J0cmFpdCcgOiAnbGFuZHNjYXBlJztcblxuICAgIGNvbnN0IHNpemVPYmogPSB7XG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBzY3JvbGxIZWlnaHQ6IHRoaXMuc2Nyb2xsSGVpZ2h0LFxuICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb24sXG4gICAgfTtcblxuICAgIHRoaXMuc2lnbmFsKCdyZXNpemUuc3RhcnQnLCBbc2l6ZU9ial0pO1xuXG4gICAgdGhpcy5sYXN0SCA9IHRoaXMuaGVpZ2h0O1xuICAgIHRoaXMubGFzdFcgPSB0aGlzLndpZHRoO1xuICAgIHRoaXMubGFzdFMgPSB0aGlzLnNjcm9sbEhlaWdodDtcbiAgfVxuXG4gIHRocm90dGxlZExpc3RlbmVyKCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLmhlaWdodCA+IHRoaXMud2lkdGggPyAncG9ydHJhaXQnIDogJ2xhbmRzY2FwZSc7XG5cbiAgICBjb25zdCBzaXplT2JqID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgc2Nyb2xsSGVpZ2h0OiB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uLFxuICAgIH07XG5cbiAgICB0aGlzLnNpZ25hbCgncmVzaXplJywgW3NpemVPYmpdKTtcblxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uICE9PSB0aGlzLmxhc3RPKSB7XG4gICAgICB0aGlzLnNpZ25hbCgncmVzaXplLm9yaWVudGF0aW9uQ2hhbmdlJywgW3NpemVPYmpdKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT09IHRoaXMubGFzdFMpIHtcbiAgICAgIHRoaXMuc2lnbmFsKCdyZXNpemUuc2Nyb2xsSGVpZ2h0Q2hhbmdlJywgW3NpemVPYmpdKTtcbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5zY3JvbGxUaW1lb3V0KTtcbiAgICB0aGlzLnNjcm9sbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2lnbmFsKCdyZXNpemUuc3RvcCcsIFtzaXplT2JqXSk7XG4gICAgfSwgdGhpcy5vcHRpb25zLnJlc2l6ZURlbGF5ICsgMSk7XG5cbiAgICB0aGlzLmxhc3RIID0gdGhpcy5oZWlnaHQ7XG4gICAgdGhpcy5sYXN0VyA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5sYXN0UyA9IHRoaXMuc2Nyb2xsSGVpZ2h0O1xuICAgIHRoaXMubGFzdE8gPSB0aGlzLm9yaWVudGF0aW9uO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc2l6ZUV2ZW50cztcbiIsImNsYXNzIFNjcm9sbEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHB1Ymxpc2hlciwgb3B0aW9ucywgc2l6ZVJlZikge1xuICAgIHRoaXMuc2lnbmFsID0gcHVibGlzaGVyLnNpZ25hbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMud2luZG93U2l6ZSA9IHNpemVSZWY7XG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gbnVsbDtcblxuICAgIHRoaXMuZGVib3VuY2VkTGlzdGVuZXIgPSB0aGlzLmRlYm91bmNlZExpc3RlbmVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy50aHJvdHRsZWRMaXN0ZW5lciA9IHRoaXMudGhyb3R0bGVkTGlzdGVuZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKCkge1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gdGhpcy5sYXN0U2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIHRoaXMuc2Nyb2xsUGVyY2VudCA9XG4gICAgICAgICh0aGlzLnNjcm9sbFRvcCAvICh0aGlzLndpbmRvd1NpemUuc2Nyb2xsSGVpZ2h0IC0gdGhpcy53aW5kb3dTaXplLmhlaWdodCkpICogMTAwO1xuICB9XG5cbiAgZ2V0U3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxQZXJjZW50OiB0aGlzLnNjcm9sbFBlcmNlbnQsXG4gICAgfTtcbiAgfVxuXG4gIGRlYm91bmNlZExpc3RlbmVyKCkge1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIHRoaXMuc2Nyb2xsUGVyY2VudCA9XG4gICAgICAgICh0aGlzLnNjcm9sbFRvcCAvICh0aGlzLndpbmRvd1NpemUuc2Nyb2xsSGVpZ2h0IC0gdGhpcy53aW5kb3dTaXplLmhlaWdodCkpICogMTAwO1xuXG4gICAgdGhpcy5zaWduYWwoJ3Njcm9sbC5zdGFydCcsIFt7XG4gICAgICBzY3JvbGxUb3A6IHRoaXMuc2Nyb2xsVG9wLFxuICAgICAgc2Nyb2xsUGVyY2VudDogdGhpcy5zY3JvbGxQZXJjZW50LFxuICAgIH1dKTtcblxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRoaXMuc2Nyb2xsVG9wO1xuICB9XG5cbiAgdGhyb3R0bGVkTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgdGhpcy5zY3JvbGxQZXJjZW50ID1cbiAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIC8gKHRoaXMud2luZG93U2l6ZS5zY3JvbGxIZWlnaHQgLSB0aGlzLndpbmRvd1NpemUuaGVpZ2h0KSkgKiAxMDA7XG5cbiAgICBjb25zdCBzY3JvbGxPYmogPSB7XG4gICAgICBzY3JvbGxUb3A6IHRoaXMuc2Nyb2xsVG9wLFxuICAgICAgc2Nyb2xsUGVyY2VudDogdGhpcy5zY3JvbGxQZXJjZW50LFxuICAgIH07XG5cbiAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsJywgW3Njcm9sbE9ial0pO1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsVG9wID4gdGhpcy5sYXN0U2Nyb2xsVG9wKSB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLmRvd24nLCBbc2Nyb2xsT2JqXSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNjcm9sbFRvcCA8IHRoaXMubGFzdFNjcm9sbFRvcCkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Njcm9sbC51cCcsIFtzY3JvbGxPYmpdKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxUb3AgPD0gMCkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Njcm9sbC50b3AnLCBbc2Nyb2xsT2JqXSk7XG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbE9iai5zY3JvbGxQZXJjZW50ID49IDEwMCkge1xuICAgICAgdGhpcy5zaWduYWwoJ3Njcm9sbC5ib3R0b20nLCBbc2Nyb2xsT2JqXSk7XG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuc2Nyb2xsVGltZW91dCk7XG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNpZ25hbCgnc2Nyb2xsLnN0b3AnLCBbc2Nyb2xsT2JqXSk7XG4gICAgfSwgdGhpcy5vcHRpb25zLnNjcm9sbERlbGF5ICsgMSk7XG5cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbFRvcDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JvbGxFdmVudHM7XG4iLCJjbGFzcyBWaXNpYmlsaXR5RXZlbnRzIHtcbiAgY29uc3RydWN0b3IocHVibGlzaGVyLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zaWduYWwgPSBwdWJsaXNoZXIuc2lnbmFsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLmNoYW5nZUxpc3RlbnRlciA9IHRoaXMuY2hhbmdlTGlzdGVudGVyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSgpIHtcbiAgICB0aGlzLnZpc2libGUgPSAhZG9jdW1lbnQuaGlkZGVuO1xuICB9XG5cbiAgZ2V0U3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc2libGU6IHRoaXMudmlzaWJsZSxcbiAgICB9O1xuICB9XG5cbiAgY2hhbmdlTGlzdGVudGVyKCkge1xuICAgIHRoaXMudmlzaWJsZSA9ICFkb2N1bWVudC5oaWRkZW47XG5cbiAgICBjb25zdCB2aXNpYmxlT2JqID0ge1xuICAgICAgdmlzaWJsZTogdGhpcy52aXNpYmxlLFxuICAgIH07XG5cbiAgICB0aGlzLnNpZ25hbCgndmlzaWJpbGl0eUNoYW5nZScsIFt2aXNpYmxlT2JqXSk7XG5cbiAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICB0aGlzLnNpZ25hbCgndmlzaWJpbGl0eUNoYW5nZS5zaG93JywgW3Zpc2libGVPYmpdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaWduYWwoJ3Zpc2liaWxpdHlDaGFuZ2UuaGlkZScsIFt2aXNpYmxlT2JqXSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZpc2liaWxpdHlFdmVudHM7XG4iXX0=
