'use strict';

var assert = require('chai').assert;
var MasterComponent = require('../');

describe('master-component object schema', function () {

  it('allow props from factory functions', function () {
    var o = MasterComponent.Object({
      n: Number,
      s: String,
      b: Boolean
    });

    assert.strictEqual(o.n, 0);
    assert.strictEqual(o.s, '');
    assert.strictEqual(o.b, false);
  });

  it('allow props from sub-objects', function () {
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


  it('allow props from $type config objects', function () {
    var o = MasterComponent.Object({
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

  it('allow MasterComponent.FixedSizeArray as $type with factory function elemType', function () {
    var o = MasterComponent.Object({
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

  it('allow MasterComponent.FixedSizeArray as $type with sub-objects elemType', function () {
    var o = MasterComponent.Object({
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

  it('allow nested MasterComponent.FixedSizeArray', function () {
    var o = MasterComponent.Object({
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
