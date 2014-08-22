
/**
 * Module dependencies.
 */

var merge = require('merge');
var each = require('each');
var eql = require('eql');

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
 * @param {String} method
 * @return {Function}
 * @api public
 */

module.exports = function(obj, method){
  var fn = toFunction(arguments, spy);
  merge(spy, proto);
  return spy.reset();

  function spy(){
    var args = [].slice.call(arguments);
    var ret = fn(arguments);
    spy.returns || spy.reset();
    spy.args.push(args);
    spy.returns.push(ret);
    spy.update();
    return ret;
  }
};

/**
 * Pseudo-prototype.
 */

var proto = {};

/**
 * Lazily match `args` and return `true` if the spy was called with them.
 *
 * @param {Arguments} args
 * @return {Boolean}
 * @api public
 */

proto.got =
proto.calledWith = function(){
  var a = [].slice.call(arguments);

  for (var i = 0, args; args = this.args[i]; i++) {
    if (eql(a,  args.slice(0, a.length))) return true;
  }

  return false;
};

/**
 * Exactly match `args` and return `true` if the spy was called with them.
 *
 * @param {Arguments} ...
 * @return {Boolean}
 * @api public
 */

proto.gotExactly =
proto.calledWithExactly = function(){
  var a = [].slice.call(arguments);

  for (var i = 0, args; args = this.args[i]; i++) {
    if (eql(a, args)) return true;
  }

  return false;
};

/**
 * `true` if the spy returned `value`.
 *
 * @param {Mixed} value
 * @return {Boolean}
 * @api public
 */

proto.returned = function(value){
  var ret = this.returns[this.returns.length - 1];
  return eql(ret, value);
};

/**
 * `true` if the spy was called once.
 *
 * @return {Boolean}
 * @api public
 */

proto.once = function(){
  return 1 == this.args.length;
};

/**
 * `true` if the spy was called twice.
 *
 * @return {Boolean}
 * @api public
 */

proto.twice = function(){
  return 2 == this.args.length;
};

/**
 * `true` if the spy was called three times.
 *
 * @return {Boolean}
 * @api public
 */

proto.thrice = function(){
  return 3 == this.args.length;
};

/**
 * Reset the spy.
 *
 * @return {Function}
 * @api public
 */

proto.reset = function(){
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

proto.restore = function(){
  if (!this.obj) return this;
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

proto.update = function(){
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

function toFunction(args, spy){
  var obj = args[0];
  var method = args[1];

  switch (args.length) {
    case 0: return function noop(){};
    case 1: return function(args){ return obj.apply(null, args); };
    case 2:
      var m = obj[method];
      merge(spy, m);
      spy.method = method;
      spy.fn = m;
      spy.obj = obj;
      obj[method] = spy;
      return function(args){
        return m.apply(obj, args);
      };
  }
}
