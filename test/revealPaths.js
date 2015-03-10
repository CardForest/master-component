"use strict";

var assert = require('chai').assert;
var Master = require('..');

describe('reveal paths', function () {
  it('should reveal $hidden properties', function () {
    var v = Master.newInstance({
      visible: {$type: Number}, //never hidden
      hidden: {$type: Number, $hidden: true},
      hiddenThenRevealed: {$type: Number, $hidden: true}
    }).$view('hiddenThenRevealed');

    assert.property(v, 'visible');
    assert.notProperty(v, 'hidden');
    assert.property(v, 'hiddenThenRevealed');
  });

  it('should reveal $hidden properties in sub objects', function () {
    var v = Master.newInstance({
      o: {
        visible: {$type: Number}, //never hidden
        hidden: {$type: Number, $hidden: true},
        hiddenThenRevealed: {$type: Number, $hidden: true}
      }
    }).$view('o.hiddenThenRevealed');

    assert.property(v.o, 'visible');
    assert.notProperty(v.o, 'hidden');
    assert.property(v.o, 'hiddenThenRevealed');
  });

  it('should reveal $hidden elements in arrays', function () {
    var v = Master.newInstance([{
      $type: {
        $type: String,
        $initialValue: 'got it',
        $hidden: true
      },
      $length: 2
    }]).$view('[0]');

    assert.property(v, '0');
    assert.strictEqual(v[0], 'got it');
    assert.notProperty(v, '1');
  });

  it('should reveal $hidden properties from array elements', function () {
    var v = Master.newInstance([{
      $type: {
        visible: {$type: Number}, //never hidden
        hidden: {$type: Number, $hidden: true},
        hiddenThenRevealed: {$type: Number, $hidden: true}
      },
      $length: 2
    }]).$view('[0].hiddenThenRevealed');

    assert.property(v[0], 'visible');
    assert.notProperty(v[0], 'hidden');
    assert.property(v[0], 'hiddenThenRevealed');

    assert.notProperty(v[1], 'hiddenThenRevealed');
  });

  it('should reveal few $hidden properties in one call', function () {
    var v = Master.newInstance({
      visible: {$type: Number}, //never hidden
      hidden: {$type: Number, $hidden: true},
      hiddenThenRevealed: {$type: Number, $hidden: true},
      o: {
        visible: {$type: Number}, //never hidden
        hidden: {$type: Number, $hidden: true},
        hiddenThenRevealed: {$type: Number, $hidden: true}
      }
    }).$view('hiddenThenRevealed', 'o.hiddenThenRevealed');

    assert.property(v, 'visible');
    assert.notProperty(v, 'hidden');
    assert.property(v, 'hiddenThenRevealed');

    assert.property(v.o, 'visible');
    assert.notProperty(v.o, 'hidden');
    assert.property(v.o, 'hiddenThenRevealed');
  });
});
