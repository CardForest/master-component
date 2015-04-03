'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('snapshots', function () {
  it('can make snapshots of object with primitive properties', function () {
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

  it('can make snapshots of nested objects', function () {
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


  it('can make snapshots of arrays', function () {
    var arr = Master.newInstance([{
      $type: Number,
      $length: 2
    }]);


    arr[0] = 5;
    arr[1] = 6;

    assert.deepEqual(arr.$snapshot(), [5, 6]);
  });

  it('can make snapshots of arrays within objects', function () {
    var o = Master.newInstance({arr: [{
      $type: Number,
      $length: 2
    }]});

    o.arr[0] = 5;
    o.arr[1] = 6;

    assert.deepEqual(o.$snapshot(), {arr: [5, 6]});
  });

  it('does not record getter or mutators', function () {
    var o = Master.newInstance({
      g: function () {return 3;},
      m: function $() {},
    });

    assert.deepEqual(o.$snapshot(), {});
  });

  it('can restore master components from snapshots', function () {
    var o = Master.newInstance({
      n: Number,
      s: String,
      b: Boolean,
      g: function () {return this.n;},
      m: function $() {return this.n = 5;},
      inner: {
        n: Number,
        s: String,
        b: Boolean
      }
    }, {n :3, s: 'test', b: true, inner: {n :4, s: 'test2', b: false}});

    assert.property(o, 'g');
    assert.property(o, 'm');
    assert.strictEqual(o.n, 3);
    o.m();
    assert.strictEqual(o.g, 5);
    assert.strictEqual(o.s, 'test');
    assert.strictEqual(o.b, true);

    assert.strictEqual(o.inner.n, 4);
    assert.strictEqual(o.inner.s, 'test2');
    assert.strictEqual(o.inner.b, false);
  });

  it('can restore master components from snapshots with nested objects', function () {
    var o = Master.newInstance({
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

  it('can restore master components from snapshots with arrays', function () {
    var o = Master.newInstance({
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


  it('does a round-trip', function () {
    var config = {
      n: Number,
      s: String,
      b: Boolean,
      inner: {
        arr: [{
          $type: Number,
          $length: 2
        }]
      }
    };
    var o = Master.newInstance(config);

    o.n = 3; o.s = 'test'; o.b = true; o.inner.arr[0] = 2; o.inner.arr[1] = 16;

    var o2 = Master.newInstance(config, o.$snapshot());

    assert.deepEqual(o, o2);
  });
});
