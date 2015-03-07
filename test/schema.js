'use strict';

var assert = require('chai').assert;
var MasterComponent = require('../index2');

describe('master-component schema', function () {

  it('allows simple factory functions', function () {
    var n = MasterComponent.newInstance(Number);
    assert.equal(n, 0);
    var s = MasterComponent.newInstance(String);
    assert.equal(s, '');
    var b = MasterComponent.newInstance(Boolean);
    assert.equal(b, false);
  });


  it('allows props from factory functions', function () {
    var o = MasterComponent.newInstance({
      n: Number,
      s: String,
      b: Boolean
    });

    assert.equal(o.n, 0);
    assert.equal(o.s, '');
    assert.equal(o.b, false);
  });

  it('allows props from sub-objects', function () {
    var o = MasterComponent.newInstance({
      inner: {
        n: Number,
        s: String,
        b: Boolean
      }
    });

    assert.equal(o.inner.n, 0);
    assert.equal(o.inner.s, '');
    assert.equal(o.inner.b, false);
  });

  it('allows props from $type config objects', function () {
    var o = MasterComponent.newInstance({
      n: {$type: Number, $value: 3},
      s: {$type: String, $value: 'test'},
      b: {$type: Boolean, $value: true},
      inner: {
        $type: {
          n: {$type: Number},
          s: {$type: String},
          b: {$type: Boolean, $value: false}
        }
      }
    });

    assert.equal(o.n, 3);
    assert.equal(o.s, 'test');
    assert.equal(o.b, true);

    assert.equal(o.inner.n, 0);
    assert.equal(o.inner.s, '');
    assert.equal(o.inner.b, false);
  });


  it('allows MasterComponent.FixedSizeArray as $type with factory function elemType', function () {
    var o = MasterComponent.newInstance({
      arr: {
        $type: MasterComponent.FixedSizeArray,
        size: 4,
        elemType: Number
      }
    });

    assert.strictEqual(o.arr.length, 4);
    assert.equal(o.arr[0], 0);
    assert.equal(o.arr[3], 0);
  });

  it('allows MasterComponent.FixedSizeArray as $type with sub-objects elemType', function () {
    var o = MasterComponent.newInstance({
      arr: {
        $type: MasterComponent.FixedSizeArray,
        size: 4,
        elemType: {
          n: Number,
          s: String,
          b: Boolean
        }
      }
    });

    assert.strictEqual(o.arr.length, 4);
    assert.equal(o.arr[0].n, 0);
    assert.equal(o.arr[3].b, false);
  });

  it('allows nested MasterComponent.FixedSizeArray', function () {
    var o = MasterComponent.newInstance({
      s: String,
      inner: {
        s: String,
        arr: {
          $type: MasterComponent.FixedSizeArray,
          size: 4,
          elemType: {
            b: Boolean,
            innerArr: {
              $type: MasterComponent.FixedSizeArray,
              size: 2,
              elemType: Number
            }
          }
        }
      }
    });

    assert.equal(o.s, '');
    assert.equal(o.inner.s, '');
    assert.strictEqual(o.inner.arr.length, 4);
    assert.equal(o.inner.arr[3].b, false);
    assert.strictEqual(o.inner.arr[2].innerArr.length, 2);
    assert.equal(o.inner.arr[0].innerArr[1], 0);
  });
});
