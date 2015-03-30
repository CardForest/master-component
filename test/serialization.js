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

    assert.deepEqual(o.$snapshot(), {n: 3, s: 'test', b: true});
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

    assert.deepEqual(o.$snapshot(), {inner: {n: 3, s: 'test', b: true}});
  });


  it('can serialize arrays', function () {
    var arr = Master.newInstance([{
      $type: Number,
      $length: 2
    }]);


    arr[0] = 5;
    arr[1] = 6;

    assert.deepEqual(arr.$snapshot(), [5, 6]);
  });

  it('can serialize arrays within objects', function () {
    var o = Master.newInstance({arr: [{
      $type: Number,
      $length: 2
    }]});

    o.arr[0] = 5;
    o.arr[1] = 6;

    assert.deepEqual(o.$snapshot(), {arr: [5, 6]});
  });

  it('can create master components from snapshots', function () {
    var o = Master.restore({
      n: Number,
      s: String,
      b: Boolean,
      inner: {
        n: Number,
        s: String,
        b: Boolean
      }
    }, {n :3, s: 'test', b: true, inner: {n :4, s: 'test2', b: false}});

    assert.strictEqual(o.n, 3);
    assert.strictEqual(o.s, 'test');
    assert.strictEqual(o.b, true);

    assert.strictEqual(o.inner.n, 4);
    assert.strictEqual(o.inner.s, 'test2');
    assert.strictEqual(o.inner.b, false);
  });

  it('can create master components from snapshots with nested objects', function () {
    var o = Master.restore({
      inner: {
        n: Number,
        s: String,
        b: Boolean
      }
    }, {inner: {n :4, s: 'test', b: false}});

    assert.strictEqual(o.inner.n, 4);
    assert.strictEqual(o.inner.s, 'test');
    assert.strictEqual(o.inner.b, false);
  });

  it('can create master components from snapshots with arrays', function () {
    var o = Master.restore({
      arr: [{
        $type: {
          n: Number,
          s: String,
          b: Boolean
        },
        $length: 2
      }]
    }, {arr: [{n : 4, s: 'test', b: true}, {n : 5, s: 'test2', b: false}]});

    assert.strictEqual(o.arr[0].n, 4);
    assert.strictEqual(o.arr[0].s, 'test');
    assert.strictEqual(o.arr[0].b, true);

    assert.strictEqual(o.arr[1].n, 5);
    assert.strictEqual(o.arr[1].s, 'test2');
    assert.strictEqual(o.arr[1].b, false);
  });
});
