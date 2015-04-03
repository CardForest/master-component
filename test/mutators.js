'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('mutator', function () {
  it('can access it\'s and change owner object', function () {
    var o = Master.newInstance({
      n: Number,
      m: function $() {
        this.n = this.n + 3;
      },
      m2: function $() {
        this.n = this.n - 2;
      }
    });

    o.m();
    assert.strictEqual(o.n, 3);

    o.m2();
    assert.strictEqual(o.n, 1);
  });
});
