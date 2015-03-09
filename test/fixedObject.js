'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('FixedObject', function () {
  it('allows primitive properties', function () {
    var o = Master.newInstance({
      $type: Master.FixedObject,
      $schema: {
        n: Number,
        s: String,
        b: Boolean
      }
    });

    assert.strictEqual(o.n, 0);
    assert.strictEqual(o.s, '');
    assert.strictEqual(o.b, false);
  });

  it('allows nested FixedObject', function () {
    var o = Master.newInstance({
      $type: Master.FixedObject,
      $schema: {
        o: {
          $type: Master.FixedObject,
          $schema: {
            n: Number
          }
        }
      }
    });

    assert.property(o, 'o');
    assert.strictEqual(o.o.n, 0);
  });
});

describe('FixedObject - syntactic sugar', function () {
  it('allows primitive properties', function () {
    var o = Master.newInstance({
      n: Number,
      s: String,
      b: Boolean
    });

    assert.strictEqual(o.n, 0);
    assert.strictEqual(o.s, '');
    assert.strictEqual(o.b, false);
  });

  it('allows nested FixedObject', function () {
    var o = Master.newInstance({
      o: {
        n: Number
      }
    });

    assert.property(o, 'o');
    assert.strictEqual(o.o.n, 0);
  });
});

describe('FixedObject - strictness', function () {
  it('throws exception on property add', function () {
    var o = Master.newInstance({n: Number});

    assert.throws(function() {o.s = 'should throw';});
  });

  it('throws exception on assignment of incorrect primitive type', function () {
    var o = Master.newInstance({n: Number});

    assert.throws(function() {o.n = 'should throw';});
  });

  it('throws exception on property delete', function () {
    var o = Master.newInstance({n: Number});

    assert.throws(function() {delete o.n;});
  });

  it('throws exception on non primitive assignment', function () {
    var o = Master.newInstance({
      o: {
        s: String
      }
    });

    assert.throws(function() {o.o = {s: 'should throw'};});
  });
});
