'use strict';

/*
 * Module dependencies.
 */

var extend = require('@ndhoule/extend');
var eql = require('equals');

/**
 * Pseudo-prototype.
 */

var proto = {};

/**
 * Lazily match `args` and return `true` if the spy was called with them.
 *
 * @param {Arguments} args
 * @return {boolean}
 * @api public
 */
proto.got = proto.calledWith = proto.gotLazy = proto.calledWithLazy = function() {
  var a = Array.prototype.slice.call(arguments);

  // eslint-disable-next-line no-cond-assign
  for (var i = 0, args; args = this.args[i]; i++) {
    if (eql(a,  args.slice(0, a.length))) return true;
  }

  return false;
};

/**
 * Exactly match `args` and return `true` if the spy was called with them.
 *
 * @param {Arguments} ...
 * @return {boolean}
 * @api public
 */
proto.gotExactly = proto.calledWithExactly = function() {
  var a = Array.prototype.slice.call(arguments);

  // eslint-disable-next-line no-cond-assign
  for (var i = 0, args; args = this.args[i]; i++) {
    if (eql(a, args)) {
      return true;
    }
  }

  return false;
};

/**
 * `true` if the spy returned `value`.
 *
 * @param {*} value
 * @return {boolean}
 * @api public
 */
proto.returned = function(value) {
  var ret = this.returns[this.returns.length - 1];
  return eql(ret, value);
};

/**
 * `true` if the spy was called once.
 *
 * @return {boolean}
 * @api public
 */
proto.once = function() {
  return this.args.length === 1;
};

/**
 * `true` if the spy was called twice.
 *
 * @return {boolean}
 * @api public
 */
proto.twice = function() {
  return this.args.length === 2;
};

/**
 * `true` if the spy was called three times.
 *
 * @return {boolean}
 * @api public
 */
proto.thrice = function() {
  return this.args.length === 3;
};

/**
 * Reset the spy.
 *
 * @return {Function}
 * @api public
 */
proto.reset = function() {
  this.returns = [];
  this.args = [];
  this.update();
  return this;
};

/**
 * Restore.
 *
 * @return {Function}
 * @api public
 */
proto.restore = function() {
  if (!this.obj) {
    return this;
  }
  var m = this.method;
  var fn = this.fn;
  this.obj[m] = fn;
  return this;
};

/**
 * Update the spy.
 *
 * @return {Function}
 * @api private
 */
proto.update = function() {
  this.called = !! this.args.length;
  this.calledOnce = this.once();
  this.calledTwice = this.twice();
  this.calledThrice = this.thrice();
  return this;
};

/**
 * To function.
 *
 * @param {...} args
 * @param {Function} spy
 * @return {Function}
 * @api private
 */
function toFunction(args, spy) {
  var obj = args[0];
  var method = args[1];

  switch (args.length) {
  case 0: return function noop() {};
  case 1: return function(args) { return obj.apply(null, args); };
  case 2:
  default:
    var m = obj[method];
    extend(spy, m);
    spy.method = method;
    spy.fn = m;
    spy.obj = obj;
    obj[method] = spy;
    return function(args) {
      return m.apply(obj, args);
    };
  }
}

/**
 * Create a test spy with `obj`, `method`.
 *
 * Examples:
 *
 *      s = require('spy')({}, 'toString');
 *      s = require('spy')(document.write);
 *      s = require('spy')();
 *
 * @param {Object|Function} obj
 * @param {string} method
 * @return {Function}
 * @api public
 */
// eslint-disable-next-line no-unused-vars
module.exports = function(obj, method) {
  var fn = toFunction(arguments, spy);
  extend(spy, proto);
  return spy.reset();

  function spy() {
    var args = Array.prototype.slice.call(arguments);
    var ret = fn(arguments);
    spy.returns || spy.reset();
    spy.args.push(args);
    spy.returns.push(ret);
    spy.update();
    return ret;
  }
};
