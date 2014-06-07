
/**
 * Module dependencies.
 */

var merge = require('merge');
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
  var fn = toFunction(arguments);
  return merge(spy, proto);

  function spy(){
    var args = [].slice.call(arguments);
    var ret = fn(arguments);
    spy.returns = spy.returns || [];
    spy.args = spy.args || [];
    spy.args.push(args);
    spy.returns.push(ret);
    spy.calledOnce = spy.once();
    spy.calledTwice = spy.twice();
    spy.calledThrice = spy.thrice();
    spy.called = true;
    return ret;
  }
};

/**
 * Prototype.
 */

var proto = {};

/**
 * `true` if the spy was called with `args`.
 * 
 * @param {Arguments} ...
 * @return {Boolean}
 * @api public
 */

proto.got =
proto.calledWith = function(n){
  var a = [].slice.call(arguments);
  var b = this.args[this.args.length - 1];
  return eql(a, b);
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
 * To function.
 * 
 * @param {...} args
 * @return {Function}
 * @api private
 */

function toFunction(args){
  var obj = args[0];
  var method = args[1];

  switch (args.length) {
    case 0: return function noop(){};
    case 1: return function(args){ return obj.apply(null, args); };
    case 2: return function(args){
      return obj[method].apply(obj, args);
    };
  }
}
