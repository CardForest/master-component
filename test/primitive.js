'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('primitive', function () {
  it('has syntactic sugar', function () {
    var o = Master.newInstance({
      n: Number,
      s: String,
      b: Boolean
    });

    assert.strictEqual(o.n, 0);
    assert.strictEqual(o.s, '');
    assert.strictEqual(o.b, false);
  });

  it('accepts $initialValue', function () {
    var o = Master.newInstance({
      n: {$type: Number, $initialValue: 3},
      s: {$type: String, $initialValue: 'test'},
      b: {$type: Boolean, $initialValue: true}
    });

    assert.strictEqual(o.n, 3);
    assert.strictEqual(o.s, 'test');
    assert.strictEqual(o.b, true);
  });
});
