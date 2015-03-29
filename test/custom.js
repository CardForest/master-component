'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var Master = require('..');


function CustomComponent(config, keyPath, changelog) {
  Master.Component.call(this, config, keyPath, changelog);

  this.innerVal = config.param;
}
CustomComponent.prototype = Object.create(Master.Component.prototype);

describe('custom components', function () {
  it('should initiate custom components', function () {
    var spy = sinon.spy(CustomComponent);

    Master.newInstance({
      s: spy
    });

    assert(spy.calledWithNew());
    assert(spy.calledOnce);
    assert(spy.calledWith({$type: spy}, ['s']));
    assert.strictEqual(spy.args[0][2].constructor.name, 'Changelog');
  });

  it('should pass parameter to custom components on initialization', function () {
    var spy = sinon.spy(CustomComponent);

    var o = Master.newInstance({
      s: {$type: spy, param: 'paramValue'}
    });

    assert(spy.calledWith({$type: spy, param: 'paramValue'}));
    assert.strictEqual(o.s.innerVal, 'paramValue');
  });

  it('should delegate to $setter if available', function () {
    var spy = sinon.spy(CustomComponent);
    spy.$setter = sinon.spy(function (newVal) {
      this.innerVal = this.innerVal + newVal;
    });

    var o = Master.newInstance({
      s: {$type: spy, param: 3}
    });

    o.s = 2;

    assert(spy.$setter.calledOnce);
    assert(spy.$setter.calledWith(2));
    assert.strictEqual(o.s.innerVal, 5);
  });

  it('should should throw is setting without $setter', function () {
    var spy = sinon.spy(CustomComponent);

    var o = Master.newInstance({
      s: {$type: spy, param: 3}
    });

    assert.throw(function () {
      o.s = 2;
    });
  });
});

