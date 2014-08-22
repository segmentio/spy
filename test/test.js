
describe('spy', function(){
  var assert = require('assert');
  var spy = require('spy');
  var s;

  beforeEach(function(){
    s = spy();
  });

  it('should support methods', function(){
    var arr = [];
    var s = spy(arr, 'push');
    s(1, 2, 3);
    assert.deepEqual([1, 2, 3], arr);
    assert(arr.push.calledWith(1, 2, 3));
  })

  it('should restore methods with `.restore()`', function(){
    var arr = [];
    var orig = arr.push;
    var s = spy(arr, 'push');
    s(1);
    assert.deepEqual([1], arr);
    s.restore();
    assert(orig == arr.push);
  })

  it('should record arguments', function(){
    s(1, 2, 3);
    s(4, 5, 6);
    s(7, 8, 9);
    assert.deepEqual(s.args, [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  })

  it('should record returned values', function(){
    s(1, 2, 3);
    s(4, 5, 6);
    s(7, 8, 9);
    assert.deepEqual(s.returns, [
      undefined,
      undefined,
      undefined
    ]);
  })

  it('should mixin host properties', function(){
    var host = { fn: function(){} };
    host.fn.prop = true;
    spy(host, 'fn');
    assert(host.fn.prop);
  })

  describe('.got()', function(){
    it('should assert arguments correctly', function(){
      s(1, 2, 3);
      assert(s.got(1, 2, 3));
      s(4, 5, [6]);
      assert(s.got(4, 5, [6]));
    })

    it('should lazy match arguments', function(){
      s(1, 2, 3);
      assert(s.got(1, 2));
      s(4, 5, [6]);
      assert(s.got(4));
    })

    it('should match any of the calls', function(){
      s(1, 2, 3);
      s(4, 5, 6);
      s(7, 8, 9);
      assert(s.got(1, 2, 3));
      assert(s.got(4, 5));
      assert(s.got(7));
    })
  })

  describe('.gotLazy()', function(){
    it('should alias .got()', function(){
      assert(spy().gotLazy == spy().got);
    })
  })

  describe('.calledWith()', function(){
    it('should alias .got()', function(){
      assert(spy().calledWith == spy().got);
    })
  })

  describe('.calledWithLazy()', function(){
    it('should alias .got()', function(){
      assert(spy().calledWithLazy == spy().got);
    })
  })

  describe('.gotExactly()', function(){
    it('should assert arguments correctly', function(){
      s(1, 2, 3);
      assert(s.gotExactly(1, 2, 3));
      s(4, 5, [6]);
      assert(s.gotExactly(4, 5, [6]));
    })

    it('should not lazy match arguments', function(){
      s(1, 2, 3);
      assert(!s.gotExactly(1, 2));
      s(4, 5, [6]);
      assert(!s.gotExactly(4));
    })

    it('should match any of the calls', function(){
      s(1, 2, 3);
      s(4, 5, 6);
      s(7, 8, 9);
      assert(s.got(1, 2, 3));
      assert(s.got(4, 5, 6));
      assert(s.got(7, 8, 9));
    })
  })

  describe('.calledWithExactly()', function(){
    it('should alias .gotExactly()', function(){
      assert(spy().calledWithExactly == spy().gotExactly);
    })
  })

  describe('.returned()', function(){
    it('should assert return values correctly', function(){
      var s = spy(window.btoa);
      s('test');
      assert(s.returned('dGVzdA=='));
      assert('dGVzdA==' == s.returns[0]);
      s('foo');
      assert(s.returned('Zm9v'));
      assert('Zm9v' == s.returns[1]);
    })
  })

  describe('.once()', function(){
    it('should be true only when called once', function(){
      assert(!s.once());
      s(1);
      assert(s.once());
      s(1);
      assert(!s.once());
    })
  })

  describe('.calledOnce', function(){
    it('should be true only when called once', function(){
      assert(!s.calledOnce);
      s(1);
      assert(s.calledOnce);
      s(1);
      assert(!s.calledOnce);
    })
  })

  describe('.twice()', function(){
    it('should be true when called twice', function(){
      assert(!s.twice());
      s(1);
      assert(!s.twice());
      s(1);
      assert(s.twice());
      s(1);
      assert(!s.twice());
    })
  })

  describe('.calledTwice', function(){
    it('should be true when called twice', function(){
      assert(!s.calledTwice);
      s(1);
      assert(!s.calledTwice);
      s(1);
      assert(s.calledTwice);
      s(1);
      assert(!s.calledTwice);
    })
  })

  describe('.thrice()', function(){
    it('should be true when called three times', function(){
      assert(!s.thrice());
      s(1);
      assert(!s.thrice());
      s(1);
      assert(!s.thrice());
      s(1);
      assert(s.thrice());
      s(1);
      assert(!s.thrice());
    })
  })

  describe('.calledThrice', function(){
    it('should be true when called three times', function(){
      assert(!s.calledThrice);
      s(1);
      assert(!s.calledThrice);
      s(1);
      assert(!s.calledThrice);
      s(1);
      assert(s.calledThrice);
      s(1);
      assert(!s.calledThrice);
    })
  })

  describe('.reset()', function(){
    it('should reset the spy', function(){
      var s = spy();
      s(1);
      s(2);
      s(3);
      assert(3 == s.args.length);
      assert(3 == s.returns.length);
      s.reset();
      assert(0 == s.args.length);
      assert(0 == s.returns.length);
      assert(!s.calledOnce);
      assert(!s.calledTwice);
      assert(!s.calledThrice);
      assert(!s.called);
    })
  })
})
