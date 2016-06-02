'use strict';

var assert = require('proclaim');
var equals = require('@segment/equals');
var spy = require('../lib');

describe('spy', function() {
  var s;

  beforeEach(function() {
    s = spy();
  });

  it('should support methods', function() {
    var arr = [];
    var s = spy(arr, 'push');
    s(1, 2, 3);
    assert(equals(arr, [1, 2, 3]));
    assert(arr.push.calledWith(1, 2, 3));
  });

  it('should restore methods with `.restore()`', function() {
    var arr = [];
    var orig = arr.push;
    var s = spy(arr, 'push');
    s(1);
    assert(equals(arr, [1]));
    s.restore();
    assert(arr.push === orig);
  });

  it('should record arguments', function() {
    s(1, 2, 3);
    s(4, 5, 6);
    s(7, 8, 9);
    assert(equals(s.args, [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]));
  });

  it('should record returned values', function() {
    s(1, 2, 3);
    s(4, 5, 6);
    s(7, 8, 9);
    assert(equals(s.returns, [
      undefined,
      undefined,
      undefined
    ]));
  });

  it('should mixin host properties', function() {
    var host = { fn: function() {} };
    host.fn.prop = true;
    spy(host, 'fn');
    assert(host.fn.prop);
  });

  describe('.got()', function() {
    it('should assert arguments correctly', function() {
      s(1, 2, 3);
      assert(s.got(1, 2, 3));
      s(4, 5, [6]);
      assert(s.got(4, 5, [6]));
    });

    it('should lazy match arguments', function() {
      s(1, 2, 3);
      assert(s.got(1, 2));
      s(4, 5, [6]);
      assert(s.got(4));
    });

    it('should match any of the calls', function() {
      s(1, 2, 3);
      s(4, 5, 6);
      s(7, 8, 9);
      assert(s.got(1, 2, 3));
      assert(s.got(4, 5));
      assert(s.got(7));
    });
  });

  describe('.gotLazy()', function() {
    it('should alias .got()', function() {
      assert(spy().gotLazy === spy().got);
    });
  });

  describe('.calledWith()', function() {
    it('should alias .got()', function() {
      assert(spy().calledWith === spy().got);
    });
  });

  describe('.calledWithLazy()', function() {
    it('should alias .got()', function() {
      assert(spy().calledWithLazy === spy().got);
    });
  });

  describe('.gotExactly()', function() {
    it('should assert arguments correctly', function() {
      s(1, 2, 3);
      assert(s.gotExactly(1, 2, 3));
      s(4, 5, [6]);
      assert(s.gotExactly(4, 5, [6]));
    });

    it('should not lazy match arguments', function() {
      s(1, 2, 3);
      assert(!s.gotExactly(1, 2));
      s(4, 5, [6]);
      assert(!s.gotExactly(4));
    });

    it('should match any of the calls', function() {
      s(1, 2, 3);
      s(4, 5, 6);
      s(7, 8, 9);
      assert(s.got(1, 2, 3));
      assert(s.got(4, 5, 6));
      assert(s.got(7, 8, 9));
    });
  });

  describe('.calledWithExactly()', function() {
    it('should alias .gotExactly()', function() {
      assert(spy().calledWithExactly === spy().gotExactly);
    });
  });

  describe('.returned()', function() {
    it('should assert return values correctly', function() {
      var s = spy(window.encodeURIComponent);
      s('testing 4 u');
      assert(s.returned('testing%204%20u'));
      assert(s.returns[0] === 'testing%204%20u');
      s('testing 4 u 2');
      assert(s.returned('testing%204%20u%202'));
      assert(s.returns[1] === 'testing%204%20u%202');
    });
  });

  describe('.once()', function() {
    it('should be true only when called once', function() {
      assert(!s.once());
      s(1);
      assert(s.once());
      s(1);
      assert(!s.once());
    });
  });

  describe('.calledOnce', function() {
    it('should be true only when called once', function() {
      assert(!s.calledOnce);
      s(1);
      assert(s.calledOnce);
      s(1);
      assert(!s.calledOnce);
    });
  });

  describe('.twice()', function() {
    it('should be true when called twice', function() {
      assert(!s.twice());
      s(1);
      assert(!s.twice());
      s(1);
      assert(s.twice());
      s(1);
      assert(!s.twice());
    });
  });

  describe('.calledTwice', function() {
    it('should be true when called twice', function() {
      assert(!s.calledTwice);
      s(1);
      assert(!s.calledTwice);
      s(1);
      assert(s.calledTwice);
      s(1);
      assert(!s.calledTwice);
    });
  });

  describe('.thrice()', function() {
    it('should be true when called three times', function() {
      assert(!s.thrice());
      s(1);
      assert(!s.thrice());
      s(1);
      assert(!s.thrice());
      s(1);
      assert(s.thrice());
      s(1);
      assert(!s.thrice());
    });
  });

  describe('.calledThrice', function() {
    it('should be true when called three times', function() {
      assert(!s.calledThrice);
      s(1);
      assert(!s.calledThrice);
      s(1);
      assert(!s.calledThrice);
      s(1);
      assert(s.calledThrice);
      s(1);
      assert(!s.calledThrice);
    });
  });

  describe('.reset()', function() {
    it('should reset the spy', function() {
      var s = spy();
      s(1);
      s(2);
      s(3);
      assert(s.args.length === 3);
      assert(s.returns.length === 3);
      s.reset();
      assert(s.args.length === 0);
      assert(s.returns.length === 0);
      assert(!s.calledOnce);
      assert(!s.calledTwice);
      assert(!s.calledThrice);
      assert(!s.called);
    });
  });
});
