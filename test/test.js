
describe('spy', function(){
  var assert = require('assert');
  var spy = require('spy');
  var s;

  describe('.calledWith', function(){
    it('should alias .got', function(){
      assert(spy().calledWith == spy().got);
    })
  })


  beforeEach(function(){
    s = spy();
  });

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

  describe('.calledOnce', function(){
    it('should be true only when the function was called once', function(){
      assert(!s.calledOnce);
      s(1);
      assert(s.calledOnce);
      s(1);
      assert(!s.calledOnce);
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

  describe('.calledThrice', function(){
    it('should be true when called three times', function(){
      assert(!s.calledThrice);
      s(1);
      assert(!s.calledThrice);
      s(1);
      assert(!s.calledThrice);
      s(1);
      assert(s.calledThrice);
    })
  })

  describe('.got()', function(){
    it('should assert arguments correctly', function(){
      s(1, 2, 3);
      assert(s.got(1, 2, 3));
      s(4, 5, [6]);
      assert(s.got(4, 5, [6]));
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
