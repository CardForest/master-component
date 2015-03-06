'use strict';

var assert = require('chai').assert;
var MasterComponent = require('../index2');

describe('master-component schema', function () {

  it('allows simple factory functions', function () {
    var n = MasterComponent(Number);
    assert.strictEqual(n, 0);
    var s = MasterComponent(String);
    assert.strictEqual(s, '');
    var b = MasterComponent(Boolean);
    assert.strictEqual(b, false);
  });


  it('allows props from factory functions', function () {
    var o = MasterComponent({
      n: Number,
      s: String,
      b: Boolean
    });

    assert.strictEqual(o.n, 0);
    assert.strictEqual(o.s, '');
    assert.strictEqual(o.b, false);
  });

  it('allows props from sub-objects', function () {
    var o = MasterComponent({
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

  it('allows props from $type config objects', function () {
    var o = MasterComponent({
      n: {$type: Number},
      s: {$type: String},
      b: {$type: Boolean},
      inner: {
        $type: {
          n: {$type: Number},
          s: {$type: String},
          b: {$type: Boolean}
        }
      }
    });

    assert.strictEqual(o.n, 0);
    assert.strictEqual(o.s, '');
    assert.strictEqual(o.b, false);

    assert.strictEqual(o.inner.n, 0);
    assert.strictEqual(o.inner.s, '');
    assert.strictEqual(o.inner.b, false);
  });


  it('allows MasterComponent.FixedSizeArray as $type with factory function elemType', function () {
    var o = MasterComponent({
      arr: {
        size: 4,
        $type: MasterComponent.FixedSizeArray,
        elemType: Number
      }
    });

    assert.strictEqual(o.arr.length, 4);
    assert.strictEqual(o.arr[0], 0);
    assert.strictEqual(o.arr[3], 0);
  });

  it('allows MasterComponent.FixedSizeArray as $type with sub-objects elemType', function () {
    var o = MasterComponent({
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
    assert.strictEqual(o.arr[0].n, 0);
    assert.strictEqual(o.arr[3].b, false);
  });

  it('allows nested MasterComponent.FixedSizeArray', function () {
    var o = MasterComponent({
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

    assert.strictEqual(o.s, '');
    assert.strictEqual(o.inner.s, '');
    assert.strictEqual(o.inner.arr.length, 4);
    assert.strictEqual(o.inner.arr[3].b, false);
    assert.strictEqual(o.inner.arr[2].innerArr.length, 2);
    assert.strictEqual(o.inner.arr[0].innerArr[1], 0);
  });
});
