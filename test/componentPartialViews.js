'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('component partial views', function () {
  it('normally returns the same values', function () {
    var v = Master.newInstance({
      n: {$type: Number, $initialValue: 3},
      s: {$type: String, $initialValue: 'test'},
      b: {$type: Boolean, $initialValue: true}
    }).$view();

    assert.strictEqual(v.n, 3);
    assert.strictEqual(v.s, 'test');
    assert.strictEqual(v.b, true);
  });

  it('properties with $hidden property are not returned', function () {
    var v = Master.newInstance({
      n: {$type: Number, $hidden: true},
      s: {$type: String, $hidden: true},
      b: {$type: Boolean, $hidden: true},
      o: {$type: {n: Number}, $hidden: true},
      a: {$type: Master.FixedArray, $elem: Number, $length: 3, $hidden: true}
    }).$view();

    assert.notProperty(v, 'n');
    assert.notProperty(v, 's');
    assert.notProperty(v, 'b');
    assert.notProperty(v, 'o');
    assert.notProperty(v, 'a');
  });

  it('inner objects properties with $hidden property are not returned', function () {
    var v = Master.newInstance({
      o: {
        n: {$type: Number, $hidden: true}
      }
    }).$view();

    assert.notProperty(v.o, 'n');
  });

  it('inner arrays properties with $hidden property are not returned', function () {
    var v = Master.newInstance({
      a: {$type: Master.FixedArray, $elem: {$type: Number, $hidden: true}, $length: 3}
    }).$view();

    assert.strictEqual(v.a.length, 3);
    assert.notProperty(v.a, 0);
  });

  it('properties within array elements with $hidden property are not returned', function () {
    var v = Master.newInstance([{
      $type: {
        n: {$type: Number, $initialValue: 3},
        n_hidden: {$type: Number, $hidden: true, $initialValue: 3}
      },
      $length: 3
    }]).$view();

    assert.strictEqual(v.length, 3);
    assert.strictEqual(v[0].n, 3);
    assert.notProperty(v[0], 'n_hidden');
  });
});
