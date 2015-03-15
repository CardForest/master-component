'use strict';

var assert = require('chai').assert;
var Master = require('..');

describe('getters', function () {
  it('can access it\'s owner object', function () {
    var o = Master.newInstance({
      n: Number,
      g: function() {
        return this.n + 1;
      }
    });

    assert.strictEqual(o.g, 1);
  });

  it('can access other getters in it\' owner object', function () {
    var o = Master.newInstance({
      n: Number,
      g1: function() {
        return this.n + 1;
      },
      g2: function() {
        return this.g1 + 1;
      }
    });

    assert.strictEqual(o.g2, 2);
  });

  it('works in inner objects', function () {
    var o = Master.newInstance({
      inner: [{
        $type: {
          n: Number,
          g: function() {
            return this.n + 1;
          }
        },
        $length: 2
      }]
    });

    assert.strictEqual(o.inner[0].g, 1);
  });
});
