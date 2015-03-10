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

    assert.strictEqual(o.$changelog[0].name, 'setPrimitiveValue');
    assert.strictEqual(o.$changelog[0].args[0][0], 'n');
    assert.strictEqual(o.$changelog[0].args[1], 2);

    assert.strictEqual(o.$changelog[1].name, 'setPrimitiveValue');
    assert.strictEqual(o.$changelog[1].args[0][0], 's');
    assert.strictEqual(o.$changelog[1].args[1], 'some value');

    assert.strictEqual(o.$changelog[2].name, 'setPrimitiveValue');
    assert.strictEqual(o.$changelog[2].args[0][0], 'b');
    assert.strictEqual(o.$changelog[2].args[1], true);
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

    assert.strictEqual(o.$changelog[0].name, 'setPrimitiveValue');
    assert.deepEqual(o.$changelog[0].args[0], ['o', 'n']);
    assert.strictEqual(o.$changelog[0].args[1], 2);

    assert.strictEqual(o.$changelog[1].name, 'setPrimitiveValue');
    assert.deepEqual(o.$changelog[1].args[0], ['o', 's']);
    assert.strictEqual(o.$changelog[1].args[1], 'some value');

    assert.strictEqual(o.$changelog[2].name, 'setPrimitiveValue');
    assert.deepEqual(o.$changelog[2].args[0], ['o', 'b']);
    assert.strictEqual(o.$changelog[2].args[1], true);
  });
});
