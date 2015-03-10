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
      {name: 'setPrimitiveValue', args: [['n'], 2]},
      {name: 'setPrimitiveValue', args: [['s'], 'some value']},
      {name: 'setPrimitiveValue', args: [['b'], true]}
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
      {name: 'setPrimitiveValue', args: [['o', 'n'], 2]},
      {name: 'setPrimitiveValue', args: [['o', 's'], 'some value']},
      {name: 'setPrimitiveValue', args: [['o', 'b'], true]}
    ]);
  });
});
