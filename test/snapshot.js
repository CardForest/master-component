'use strict';

var assert = require('chai').assert;
var MasterComponent = require('../index2');

describe('master-component snapshot', function () {
  it('does nothing if not specified on factory functions', function () {
    var o = MasterComponent.newInstance({
      n: Number,
      s: String,
      b: Boolean
    });
    o.n = 3;
    o.s = 'test';
    o.b = true;

    assert.equal(o.n.$snapshot(), 3);
    assert.equal(o.$snapshot().n, 3);

    assert.equal(o.s.$snapshot(), 'test');
    assert.equal(o.$snapshot().s, 'test');

    assert.equal(o.b.$snapshot(), true);
    assert.equal(o.$snapshot().b, true);
  });

  it('does nothing if not specified on sub-objects', function () {
    var o = MasterComponent.newInstance({
      inner: {
        n: Number,
        s: String,
        b: Boolean
      }
    });
    o.inner.n = 3;
    o.inner.s = 'test';
    o.inner.b = true;

    var oSnapshot = o.$snapshot();
    var innerSnapshot = o.inner.$snapshot();

    assert.equal(oSnapshot.inner.n, 3);
    assert.equal(innerSnapshot.n, 3);
    assert.equal(o.inner.n.$snapshot(), 3);

    assert.equal(oSnapshot.inner.s, 'test');
    assert.equal(innerSnapshot.s, 'test');
    assert.equal(o.inner.s.$snapshot(), 'test');

    assert.equal(oSnapshot.inner.b, true);
    assert.equal(innerSnapshot.b, true);
    assert.equal(o.inner.b.$snapshot(), true);
  });

  it('does nothing if not specified on fixed size arrays', function () {
    var o = MasterComponent.newInstance({
      arr: {
        $type: MasterComponent.FixedSizeArray,
        size: 4,
        elemType: Number
      }
    });
    var oSnapshot = o.$snapshot();
    var arrSnapshot = o.arr.$snapshot();

    assert.strictEqual(oSnapshot.arr.length, 4);
    assert.equal(oSnapshot.arr[0], 0);
    assert.equal(oSnapshot.arr[3], 0);

    assert.strictEqual(arrSnapshot.length, 4);
    assert.equal(arrSnapshot[0], 0);
    assert.equal(arrSnapshot[3], 0);
  });

  it('removes from snapshot if defined with falsy value', function () {
    var o = MasterComponent.newInstance({
      n: {$type: Number, $snapshot: false},
      s: {$type: String, $snapshot: null},
      b: {$type: Boolean, $snapshot: undefined},
    });
    o.n = 3;
    o.s = 'test';
    o.b = true;

    var snapshot = o.$snapshot();

    assert.notProperty(snapshot, 'n');
    assert.notProperty(snapshot, 's');
    assert.notProperty(snapshot, 'b');

    o = MasterComponent.newInstance({
      inner: {
        n: {$type: Number, $snapshot: false},
      },
      inner2: {
        $type: {
          n: Number
        },
        $snapshot: false
      },
      arr: {
        $type: MasterComponent.FixedSizeArray,
        size: 4,
        elemType: {$type: Number, $snapshot: false},
      },
      arr2: {
        $type: MasterComponent.FixedSizeArray,
        size: 4,
        elemType: Number,
        $snapshot: false
      }
    });
    o.inner.n = 3;
    o.inner2.n = 4;

    var oSnapshot = o.$snapshot();
    var innerSnapshot = o.inner.$snapshot();
    var arrSnapshot = o.arr.$snapshot();

    assert.property(oSnapshot, 'inner');
    assert.notProperty(oSnapshot.inner, 'n');
    assert.notProperty(innerSnapshot, 'n');

    assert.property(oSnapshot, 'arr');
    assert.notProperty(oSnapshot.arr, 0);
    assert.notProperty(arrSnapshot, 3);

    assert.notProperty(oSnapshot, 'inner2');
    assert.notProperty(oSnapshot, 'arr2');
  });

});
