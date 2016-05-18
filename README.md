# spy

Test spy.

[![CircleCI](https://circleci.com/gh/segmentio/spy.svg?style=shield&circle-token=bde46008aa250c15e0011ae95b65485deb472c83)](https://circleci.com/gh/segmentio/spy)
[![Codecov](https://img.shields.io/codecov/c/github/segmentio/spy/master.svg?maxAge=2592000)](https://codecov.io/gh/segmentio/spy)

## Installation

```sh
$ npm install @segment/spy
```

## API

### spy(obj, method)

  Create a spy with optional `obj`, `method`.

  Examples:

```js
  var s = spy();
  var s = spy(console, 'log');
  var s = spy(spy);
```

#### args[]

An array that holds all arguments.

Examples:

```js
spy(1, 2, 3);
spy(4, 5, 6);

spy.args[0]; // => [1, 2, 3]
spy.args[1]; // => [4, 5, 6]
```

#### returns[]

An array that holds all returned values.

Examples:

```js
spy = require('spy')(window.btoa);
spy('test');
spy('foo');

s.returns[0]; // => "dGVzdA=="
s.returns[1]; // => "Zm9v"
```

#### .once(), .calledOnce

`true` if the spy was called only once.

Examples:

```js
spy();
spy.once(); // => true
spy.calledOnce; // => true

spy();
spy.once(); // => false
spy.calledOnce; // => false
```

#### .twice(), .calledTwice

`true` if called twice.

#### .thrice(), .calledThrice

`true` if called thrice.

#### .got(...), .calledWith(...)

`true` if the spy was called with `...`

Examples:

```js
spy(1, 2, 3);
spy.got(1, 2, 3); // => true

spy(4, 5, 6);
spy.got(1, 2, 3); // => false

spy(1, 2, 3);
spy.got(1, 2) // => true

spy(1, 2, 3);
spy.got(1) // => true
```

#### .gotExactly(...), .calledWithExactly(...)

`true` if the spay was called with exactly `...`

Examples:

```js
spy(1, 2, 3);
spy.got(1, 2, 3); // => true

spy(4, 5, 6);
spy.got(1, 2, 3); // => false

spy(1, 2, 3);
spy.got(1, 2) // => false

spy(1, 2, 3);
spy.got(1) // => false
```

#### .returned(...)

`true` if the spy was called with `...`

Examples:

```js
spy = spy(window.btoa);

spy('test');
spy.returned('dGVzdA=='); // => true
```
