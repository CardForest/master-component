'use strict';

var assert = require('chai').assert;
var Master = require('..');
var KeyPath = require('key-path');

describe('slaves', function () {
  it('t', function() {
    var config = {
      n: Number,
      s: String,
      b: Boolean,
      m: function $() {this.n = 5;}
    };
    var master = Master.newInstance(config);
    var snapshot = master.$snapshot();

    var slave = Master.newSlave(config, snapshot, {
        performAction: function (targetKeyPath, actionId, args) {
          var target = KeyPath.get(targetKeyPath).getValueFrom(master);
          target.$changelog.reset();
          target[actionId].apply(target, args);
          return target.$changelog.view();
        }
      },
      // simple change applier
      function (changes){
        // assumes single setPrimitiveValue
        var fullKeyPath = changes[0].payload[0];
        var targetKeyPath = fullKeyPath.slice(0, fullKeyPath.length - 1);
        var target = KeyPath.get(targetKeyPath).getValueFrom(slave);
        target[fullKeyPath[fullKeyPath.length - 1]] = changes[0].payload[1];
      }
    );

    assert.deepEqual(slave, {n: 0, s: '', b: false});
    assert.property(slave, 'm');

    var changes = slave.m();
    assert.strictEqual(master.n, 5);
    assert.notEqual(slave.n, 5);
    assert.deepEqual(changes, [{payload: [['n'], 5], type: 'setPrimitiveValue'}]);

    slave.$changelog.applyChanges(changes);
    assert.strictEqual(slave.n, 5);
  });
});
