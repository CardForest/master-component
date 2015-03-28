'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var Master = require('..');


function CustomComponent(config, keyPath, changeManager) {
  this.config = config;
  this.keyPath = keyPath;
  this.changeManager = changeManager;
}
CustomComponent.prototype = Object.create(Master.Component.prototype);

describe('custom components', function () {
  it('should initiate custom components', function () {
    var spy = sinon.spy(CustomComponent);

    Master.newInstance({
      n: spy,
      s: String,
      b: Boolean
    });

    assert(spy.calledWithNew());
    assert(spy.calledOnce);
    assert(spy.calledWith({$type: spy}, ['n']));
    assert.strictEqual(spy.args[0][2].constructor.name, 'Changelog');
  });
});

