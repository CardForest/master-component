'use strict';
var assert = require('assert');
var MasterComponent = require('../');

describe('master-component node module', function () {
  it('should make an object with factory functions', function () {
    var o = MasterComponent.Object({
      n: Number,
      s: String,
      b: Boolean
    });

    assert.strictEqual(o.n, 0);
    assert.strictEqual(o.s, '');
    assert.strictEqual(o.b, false);
  });

  it('should make an object with sub-objects', function () {
    var o = MasterComponent.Object({
      inner: {
        n: Number,
        s: String,
        b: Boolean
      }
    });

    assert.strictEqual(o.inner.n, 0);
    assert.strictEqual(o.inner.s, '');
    assert.strictEqual(o.inner.b, false);
  });

  it('should make an array with factory functions', function () {
    var a = MasterComponent.Array(Number).initSize(4);

    assert.strictEqual(a.length, 4);
    assert.strictEqual(a[0], 0);
    assert.strictEqual(a[3], 0);
  });

  it('should make an array with sub-objects', function () {
    var a = MasterComponent.Array({
      n: Number,
      s: String,
      b: Boolean
    }).initSize(4);

    assert.strictEqual(a.length, 4);
    assert.strictEqual(a[0].n, 0);
    assert.strictEqual(a[3].b, false);
  });

  it('should make an object with sub-arrays', function () {
    var o = MasterComponent.Object({
      arr: [Number]
    });

    o.arr.initSize(4);

    assert.strictEqual(o.arr.length, 4);
    assert.strictEqual(o.arr[0], 0);
    assert.strictEqual(o.arr[3], 0);
  });

  it('should make compound object', function () {
    var o = MasterComponent.Object({
      s: String,
      inner: {
        s: String,
        arr: [{
          b: Boolean,
          innerArr: [Number]
        }]
      }
    });

    o.inner.arr.initSize(4);

    o.inner.arr.forEach(function (elem) {
      elem.innerArr.initSize(2);
    });

    assert.strictEqual(o.s, '');
    assert.strictEqual(o.inner.s, '');
    assert.strictEqual(o.inner.arr.length, 4);
    assert.strictEqual(o.inner.arr[3].b, false);
    assert.strictEqual(o.inner.arr[2].innerArr.length, 2);
    assert.strictEqual(o.inner.arr[0].innerArr[1], 0);
  });
});
