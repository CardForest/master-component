'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('changelog partial views', function () {
  it('normally returns the same values', function () {
    var o = Master.newInstance({
      n: Number,
      s: String,
      b: Boolean
    });

    o.n = 2;
    o.s = 'some value';
    o.b = true;

    var cv = o.$changelog.view();

    assert.deepEqual(cv, [
      {type: 'setPrimitiveValue', payload: [['n'], 2]},
      {type: 'setPrimitiveValue', payload: [['s'], 'some value']},
      {type: 'setPrimitiveValue', payload: [['b'], true]}
    ]);
  });

  it('\'setPrimitiveValue\' on properties with $hidden property are not returned', function () {
    var o = Master.newInstance({
      n: Number,
      s: {$type: String, $hidden: true},
      b: Boolean
    });

    o.n = 2;
    o.s = 'some value';
    o.b = true;

    var cv = o.$changelog.view();

    assert.deepEqual(cv, [
      {type: 'setPrimitiveValue', payload: [['n'], 2]},
      {type: 'setPrimitiveValue', payload: [['b'], true]}
    ]);
  });
});
