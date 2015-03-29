'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('serialization', function () {
  it('can serialize object with primitive properties', function () {
    var o = Master.newInstance({
      n: Number,
      s: String,
      b: Boolean
    });

    o.n = 3;
    o.s = 'test';
    o.b = true;

    assert.deepEqual(o.$serialize(), {n: 3, s: 'test', b: true});
  });

  it('can serialize nested objects', function () {
    var o = Master.newInstance({
      inner: {
        n: Number,
        s: String,
        b: Boolean
      }
    });

    o.inner.n = 3;
    o.inner.s = 'test';
    o.inner.b = true;

    assert.deepEqual(o.$serialize(), {inner: {n: 3, s: 'test', b: true}});
  });


  it('can serialize arrays', function () {
    var arr = Master.newInstance([{
      $type: Number,
      $length: 2
    }]);

    arr[0] = 5;
    arr[1] = 6;

    assert.deepEqual(arr.$serialize(), [5, 6]);
  });

  it('can serialize arrays within objects', function () {
    var o = Master.newInstance({arr: [{
      $type: Number,
      $length: 2
    }]});

    o.arr[0] = 5;
    o.arr[1] = 6;

    assert.deepEqual(o.$serialize(), {arr: [5, 6]});
  });
});
