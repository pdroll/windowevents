(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.windowevents = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

},{}],3:[function(require,module,exports){

/**
 * Module dependencies.
 */

var now = require('date-now');

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function debounced() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

},{"date-now":2}],4:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _covjs = require('covjs');

var _covjs2 = _interopRequireDefault(_covjs);

var _debounce = require('debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WindowEvents = function () {
  function WindowEvents(opts) {
    _classCallCheck(this, WindowEvents);

    var defaultOptions = {
      scrollDelay: 25,
      resizeDelay: 100
    };

    console.log(_debounce2.default);

    this.options = opts ? _extends({}, defaultOptions, opts) : defaultOptions;
    this.publisher = _covjs2.default;
  }

  _createClass(WindowEvents, [{
    key: 'listen',
    value: function listen() {
      console.log('Lets listen for events', this);
    }
  }]);

  return WindowEvents;
}();

module.exports = WindowEvents;

},{"covjs":1,"debounce":3}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY292anMvY292LmpzIiwibm9kZV9tb2R1bGVzL2RhdGUtbm93L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RlYm91bmNlL2luZGV4LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3JEQTs7OztBQUNBOzs7Ozs7OztJQUVNLFk7QUFFSix3QkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFFBQU0saUJBQWlCO0FBQ3JCLG1CQUFhLEVBRFE7QUFFckIsbUJBQWE7QUFGUSxLQUF2Qjs7QUFLQSxZQUFRLEdBQVI7O0FBRUEsU0FBSyxPQUFMLEdBQWUsb0JBQVksY0FBWixFQUErQixJQUEvQixJQUF3QyxjQUF2RDtBQUNBLFNBQUssU0FBTDtBQUNEOzs7OzZCQUVRO0FBQ1AsY0FBUSxHQUFSLENBQVksd0JBQVosRUFBc0MsSUFBdEM7QUFDRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQGF1dGhvciBEYXZlIERldm9yIDxkYXZlZGV2b3JAZ21haWwuY29tPlxuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgdmFyaWFibGUgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKlxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIF9pc0ZuKGZuKSB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIFN0b3JlIGluY3JlbWVudGluZyBJRCBmb3IgZWFjaCBwYXNzZWQgY2FsbGJhY2tcbiAqIEB0eXBlICB7SW50fVxuICovXG52YXIgY2FsbGJhY2tJZCA9IDA7XG5cbi8qKlxuICogU3RvcmUgYWxsIG9mIG91ciBjb3ZlbmFudHNcbiAqIEB0eXBlICB7QXJyYXl9XG4gKi9cbnZhciBjb3ZlbmFudHMgPSBbXTtcblxuLyoqXG4gKiBPbmUgb2JqZWN0IHRvIGhvbGQgYWxsIG9mIHRoZSBhcHBzIGNvdmVuYW50cy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBDb3YgPSB7XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGFuIGV2ZW50LCBvciBhZGQgdG8gYW4gZXhpc3RpbmcgZXZlbnRcblx0ICogQHBhcmFtICAge1N0cmluZ30gIG5hbWUgICAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCdcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgVGhlIGNsb3N1cmUgdG8gZXhlY3V0ZSB3aGVuIHNpZ25hbGVkLlxuXHQgKiBAcmV0dXJuICB7TWl4ZWR9ICAgICAgICAgICBVbmlxdWUgSUQgZm9yIGxpc3RlbmVyIG9yIGZhbHNlIG9uIGluY29ycmVjdCBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRvbjogZnVuY3Rpb24gb24oKSB7XG5cdFx0dmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1swXTtcblx0XHR2YXIgZm4gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgZm4gaXMgYSBmdW5jdGlvblxuXHRcdHZhciBpc0ZuID0gX2lzRm4oZm4pO1xuXG5cdFx0aWYgKG5hbWUgJiYgZm4gJiYgaXNGbikge1xuXHRcdFx0dmFyIF9leGlzdHMgPSBmYWxzZTtcblx0XHRcdHZhciBjYk9iaiA9IHtcblx0XHRcdFx0aWQ6ICdjb3ZfJyArICgrK2NhbGxiYWNrSWQpLFxuXHRcdFx0XHRmbjogZm5cblx0XHRcdH1cblxuXHRcdFx0Ly8gY2hlY2sgaWYgdGhpcyBldmVuIGV4aXN0c1xuXHRcdFx0Y292ZW5hbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdikge1xuXHRcdFx0XHQvLyBJZiBpdCBhbHJlYWR5IGV4aXN0cywgYWRkIHRoZSBmdW5jdGlvbiB0byBpdHMgZnVuY3Rpb25zLlxuXHRcdFx0XHRpZiAoY292Lm5hbWUgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLnB1c2goY2JPYmopO1xuXHRcdFx0XHRcdF9leGlzdHMgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIElmIGl0IGRvZXNudCBleGlzdCBjcmVhdGUgaXQuXG5cdFx0XHRpZiAoIV9leGlzdHMpIHtcblx0XHRcdFx0dmFyIG5ld0NvdmVuYW50ID0ge1xuXHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0Y2FsbGJhY2tzOiBbY2JPYmpdXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Y292ZW5hbnRzLnB1c2gobmV3Q292ZW5hbnQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNiT2JqLmlkO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgYW4gZXZlbnQgdG8gZmlyZSBvbmx5IG9uY2Vcblx0ICogQHBhcmFtICAge1N0cmluZ30gIG5hbWUgICAgTmFtZSBvZiB0aGUgZXZlbnQgbGlrZTogJ2xvYWRlZCdcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgVGhlIGNsb3N1cmUgdG8gZXhlY3V0ZSB3aGVuIHNpZ25hbGVkLlxuXHQgKiBAcmV0dXJuICB7TWl4ZWR9ICAgICAgICAgICBVbmlxdWUgSUQgZm9yIGxpc3RlbmVyIG9yIGZhbHNlIG9uIGluY29ycmVjdCBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRvbmNlOiBmdW5jdGlvbiBvbmNlKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGZuID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHR2YXIgbmV3SWQgPSAnY292XycgKyAoY2FsbGJhY2tJZCArIDEpO1xuXHRcdHZhciBvbmVUaW1lRnVuYyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0XHRcdHRoaXMub2ZmKG5hbWUsIG5ld0lkKTtcblx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLm9uKG5hbWUsIG9uZVRpbWVGdW5jKTtcblxuXHRcdHJldHVybiBuZXdJZDtcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBTaWduYWwgYW4gZXZlbnQgYW5kIHJ1biBhbGwgb2YgaXRzIHN1YnNjcmliZWQgZnVuY3Rpb25zLlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICAgIG5hbWUgIE5hbWUgb2YgdGhlIGV2ZW50IGxpa2U6ICdsb2FkZWQnO1xuXHQgKiBAcGFyYW0gIHtvYmplY3RbXX0gIGFyZ3MgIEFueSBhcmd1bWVudHMgdGhhdCBuZWVkIHRvIGJlIHNlbnQgdG8gdGhlICBmblxuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgIEN1cnJlbnQgaW5zdGFuY2Ugb2YgQ292LCB0byBhbGxvdyBmb3IgY2hhaW5pbmdcblx0ICovXG5cdHNpZ25hbDogZnVuY3Rpb24gc2lnbmFsKCkge1xuXHRcdHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1sxXTtcblxuXG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YpIHtcblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cblx0XHRcdFx0XHRjb3YuY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNiT2JqKSB7XG5cdFx0XHRcdFx0XHRjYk9iai5mbi5hcHBseShudWxsLCBhcmdzKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblxuXHQvKipcblx0ICogVW5yZWdpc3RlciAodHVybiBvZmYpIGFuIGV2ZW50LlxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICBOYW1lIG9mIHRoZSBldmVudCBsaWtlOiAnbG9hZGVkJztcblx0ICogQHBhcmFtICB7U3RyaW5nfSAgSUQgb2YgbGlzdGVuZXIgYXMgcmV0dXJuZWQgYnkgYG9uYCBmdW5jdGlvblxuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICBDdXJyZW50IGluc3RhbmNlIG9mIENvdiwgdG8gYWxsb3cgZm9yIGNoYWluaW5nXG5cdCAqL1xuXHRvZmY6IGZ1bmN0aW9uIG9mZigpIHtcblx0XHR2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzBdO1xuXHRcdHZhciBpZCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdGNvdmVuYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb3YsIGluZGV4LCBhcnIpIHtcblx0XHRcdFx0aWYgKGNvdi5uYW1lID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0Ly8gSWYgbm8gSUQgaXMgcGFzc2VkLCByZW1vdmUgYWxsIGxpc3RlbmVyc1xuXHRcdFx0XHRcdGlmICghaWQpIHtcblx0XHRcdFx0XHRcdGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGp1c3QgcmVtb3ZlIHNwZWNpZmllZCBjYWxsYmFja1xuXHRcdFx0XHRcdFx0Y292LmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNiT2JqLCBpeCwgY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjYk9iai5pZCA9PT0gaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFja3Muc3BsaWNlKGl4LCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ292O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBEYXRlLm5vdyB8fCBub3dcblxuZnVuY3Rpb24gbm93KCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxufVxuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIG5vdyA9IHJlcXVpcmUoJ2RhdGUtbm93Jyk7XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICogYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICogTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gKiBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICpcbiAqIEBzb3VyY2UgdW5kZXJzY29yZS5qc1xuICogQHNlZSBodHRwOi8vdW5zY3JpcHRhYmxlLmNvbS8yMDA5LzAzLzIwL2RlYm91bmNpbmctamF2YXNjcmlwdC1tZXRob2RzL1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gdG8gd3JhcFxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgaW4gbXMgKGAxMDBgKVxuICogQHBhcmFtIHtCb29sZWFufSB3aGV0aGVyIHRvIGV4ZWN1dGUgYXQgdGhlIGJlZ2lubmluZyAoYGZhbHNlYClcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpe1xuICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG4gIGlmIChudWxsID09IHdhaXQpIHdhaXQgPSAxMDA7XG5cbiAgZnVuY3Rpb24gbGF0ZXIoKSB7XG4gICAgdmFyIGxhc3QgPSBub3coKSAtIHRpbWVzdGFtcDtcblxuICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID4gMCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICBjb250ZXh0ID0gdGhpcztcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHRpbWVzdGFtcCA9IG5vdygpO1xuICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSB7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuIiwiaW1wb3J0IHB1Ymxpc2hlciBmcm9tICdjb3Zqcyc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnZGVib3VuY2UnO1xuXG5jbGFzcyBXaW5kb3dFdmVudHMge1xuXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIHNjcm9sbERlbGF5OiAyNSxcbiAgICAgIHJlc2l6ZURlbGF5OiAxMDAsXG4gICAgfTtcblxuICAgIGNvbnNvbGUubG9nKGRlYm91bmNlKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdHMgPyB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH0gOiBkZWZhdWx0T3B0aW9ucztcbiAgICB0aGlzLnB1Ymxpc2hlciA9IHB1Ymxpc2hlcjtcbiAgfVxuXG4gIGxpc3RlbigpIHtcbiAgICBjb25zb2xlLmxvZygnTGV0cyBsaXN0ZW4gZm9yIGV2ZW50cycsIHRoaXMpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93RXZlbnRzO1xuIl19
