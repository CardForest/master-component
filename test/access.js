'use strict';

var assert = require('chai').assert;
var MasterComponent = require('../');

describe('master-component object access', function () {

  it('respect boolean $readAccess', function () {
    var o = MasterComponent.Object({
      nPub1: Number, //$readAccess defaults to true
      nPub2: {$type: Number},
      nPub3: {
        $type: Number,
        $readAccess: true
      },
      nProtected: {
        $type: Number,
        $readAccess: false
      }
    });

    o.nPub1 = 3;
    o.nPub2 = 3;
    o.nPub3 = 3;
    o.nProtected = 3;

    var po = o.$protect();

    assert.strictEqual(o.nPub1, 3);
    assert.strictEqual(o.nPub2, 3);
    assert.strictEqual(o.nPub3, 3);
    assert.strictEqual(o.nProtected, 3);

    assert.strictEqual(po.nPub1, 3);
    assert.strictEqual(po.nPub2, 3);
    assert.strictEqual(po.nPub3, 3);
    assert.notProperty(po, 'nProtected');
  });

  it('respect boolean $readAccess in sub-objects', function () {
    var o = MasterComponent.Object({
      inner: {
        nPub: {
          $type: Number
        },
        nProtected: {
          $type: Number,
          $readAccess: false
        }
      }
    });

    o.inner.nPub = 3;
    o.inner.nProtected = 3;

    var po = o.$protect();

    assert.strictEqual(o.inner.nPub, 3);
    assert.strictEqual(o.inner.nProtected, 3);

    assert.strictEqual(po.inner.nPub, 3);
    assert.notProperty(po.inner, 'nProtected');
  });

  it('respect $readAccess function', function () {
    var o = MasterComponent.Object({
      n: {
        $type: Number,
        $readAccess: function() {return false;}
      }
    });

    o.n = 3;

    var po = o.$protect();

    assert.strictEqual(o.n, 3);
    assert.notProperty(po, 'n');
  });

  it('respect $readAccess function with permissions', function () {
    var o = MasterComponent.Object({
      n: {
        $type: Number,
        $readAccess: function(permissions) {return permissions === 'give access!';}
      }
    });

    o.n = 3;

    var po1 = o.$protect('give access!');
    var po2 = o.$protect('don\'t give access!');

    assert.strictEqual(o.n, 3);
    assert.strictEqual(po1.n, 3);
    assert.notProperty(po2, 'n');
  });
});
