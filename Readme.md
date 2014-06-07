
# spy

  test spy

## Installation

  Install with [component(1)](http://component.io):

    $ component install segmentio/spy

## API

### spy(obj, method)

  Create a spy with optional `obj`, `method`.

  Examples:

    var s = spy();
    var s = spy(console, 'log');
    var s = spy(spy);

#### args[]

  An array that holds all arguments.

  Examples:

    spy(1, 2, 3);
    spy(4, 5, 6);

    spy.args[0]; // => [1, 2, 3]
    spy.args[1]; // => [4, 5, 6]

#### returns[]

  An array that holds all returned values.

  Examples:

    spy = require('spy')(window.btoa);
    spy('test');
    spy('foo');

    s.returns[0]; // => "dGVzdA=="
    s.returns[1]; // => "Zm9v"

#### .once(), .calledOnce

  `true` if the spy was called only once.

  Examples:

    spy();
    spy.once(); // => true
    spy.calledOnce; // => true

    spy();
    spy.once(); // => false
    spy.calledOnce; // => false

#### .twice(), .calledTwice

  `true` if called twice.

#### .thrice(), .calledThrice

  `true` if called thrice.

#### .got(...), .calledWith(...)

  `true` if the spy was called with `...`

  Examples:

    spy(1, 2, 3);
    spy.got(1, 2, 3); // => true

    spy(4, 5, 6);
    spy.got(1, 2, 3); // => false

#### .returned(...)

  `true` if the spy was called with `...`

  Examples:

    spy = spy(window.btoa);

    spy('test');
    spy.returned('dGVzdA=='); // => true

## License

  MIT
