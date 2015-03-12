'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('Changelog', function () {
  it('record \'setPrimitiveValue\' on properties', function () {
    var o = Master.newInstance({
      n: Number,
      s: String,
      b: Boolean
    });

    o.n = 2;
    o.s = 'some value';
    o.b = true;

    assert.strictEqual(o.$changelog.length, 3);

    assert.deepEqual(o.$changelog.slice(0), [
      {type: 'setPrimitiveValue', payload: [['n'], 2]},
      {type: 'setPrimitiveValue', payload: [['s'], 'some value']},
      {type: 'setPrimitiveValue', payload: [['b'], true]}
    ]);
  });

  it('record \'setPrimitiveValue\' on nested properties', function () {
    var o = Master.newInstance({
      o: {
        n: Number,
        s: String,
        b: Boolean
      }
    });

    o.o.n = 2;
    o.o.s = 'some value';
    o.o.b = true;

    assert.strictEqual(o.$changelog.length, 3);

    assert.deepEqual(o.$changelog.slice(0), [
      {type: 'setPrimitiveValue', payload: [['o', 'n'], 2]},
      {type: 'setPrimitiveValue', payload: [['o', 's'], 'some value']},
      {type: 'setPrimitiveValue', payload: [['o', 'b'], true]}
    ]);
  });

  it('record \'setPrimitiveValue\' on array elements', function () {
    var arr = Master.newInstance([{
      $type: Number,
      $length: 3
    }]);

    arr[0] = 2;

    assert.strictEqual(arr.$changelog.length, 1);

    assert.deepEqual(arr.$changelog.slice(0), [
      {type: 'setPrimitiveValue', payload: [[0], 2]}
    ]);
  });

  it('record \'setPrimitiveValue\' on inner array elements', function () {
    var arr = Master.newInstance([{
      $type: [{
        $type: Number,
        $length: 3
      }],
      $length: 3
    }]);

    arr[0][1] = 2;

    assert.strictEqual(arr.$changelog.length, 1);

    assert.deepEqual(arr.$changelog.slice(0), [
      {type: 'setPrimitiveValue', payload: [[0, 1], 2]}
    ]);
  });
});
