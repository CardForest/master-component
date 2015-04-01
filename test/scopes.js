'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');

var Master = require('..');
var Scope = require('../lib/scope');

describe('scopes', function () {
  it('public scope only includes public scope and master scope includes all scopes', function () {
    assert.ok(Scope.PUBLIC.includes(null, {}));
    assert.ok(Scope.PUBLIC.includes(null, {$scope: Scope.PUBLIC}));
    assert.notOk(Scope.PUBLIC.includes(null, {$scope: Scope.MASTER}));

    assert.ok(Scope.MASTER.includes(null, {}));
    assert.ok(Scope.MASTER.includes(null, {$scope: Scope.PUBLIC}));
    assert.ok(Scope.MASTER.includes(null, {$scope: Scope.MASTER}));
  });

  it('default snapshot returns everything', function () {
    var o = Master.newInstance({
      n: {$type: Number, $scope: Scope.PUBLIC},
      s: {$type: String, $scope: 'customScope'},
      b: {$type: Boolean},
      o: {$type: {n: {$type: Number, $scope: Scope.MASTER}}, $scope: Scope.MASTER},
      a: {$type: Master.FixedArray, $elem: {n: {$type: Number, $scope: Scope.MASTER}}, $length: 3}
    });


    var s = o.$snapshot();
    assert.property(s, 'n');
    assert.property(s, 's');
    assert.property(s, 'b');
    assert.property(s, 'o');
    assert.property(s.o, 'n');
    assert.property(s, 'a');
    assert.property(s.a[0], 'n');
  });

  it('snapshot with MASTER scope returns everything', function () {
    var o = Master.newInstance({
      n: {$type: Number, $scope: Scope.PUBLIC},
      s: {$type: String, $scope: 'customScope'},
      b: {$type: Boolean},
      o: {$type: {n: {$type: Number, $scope: Scope.MASTER}}, $scope: Scope.MASTER},
      a: {$type: Master.FixedArray, $elem: {n: {$type: Number, $scope: Scope.MASTER}}, $length: 3}
    });

    var s = o.$snapshot(Scope.MASTER);
    assert.property(s, 'n');
    assert.property(s, 's');
    assert.property(s, 'b');
    assert.property(s, 'o');
    assert.property(s.o, 'n');
    assert.property(s, 'a');
    assert.property(s.a[0], 'n');
  });

  it('snapshot with public scope return only properties with default or public scope', function () {
    var s = Master.newInstance({
      n: {$type: Number, $scope: Scope.PUBLIC},
      s: {$type: String, $scope: 'customScope'},
      b: {$type: Boolean},
      o: {$type: {n: {$type: Number, $scope: Scope.MASTER}}},
      a: {$type: Master.FixedArray, $elem: {n: {$type: Number, $scope: Scope.MASTER}}, $length: 3}
    }).$snapshot(Scope.PUBLIC);

    assert.property(s, 'n');
    assert.notProperty(s, 's');
    assert.property(s, 'b');
    assert.property(s, 'o');
    assert.notProperty(s.o, 'n');
    assert.property(s, 'a');
    assert.notProperty(s.a, 'n');
  });

  //it('snapshot with custom scope can control what they return', function () {
  //  var spy = sinon.spy(function(_, config) {return config.hasOwnProperty('$scope') && config.$scope === 'customScope'});
  //
  //  var s = Master.newInstance({
  //    n: {$type: Number, $scope: Scope.PUBLIC},
  //    s: {$type: String, $scope: 'customScope'},
  //    b: {$type: Boolean},
  //    o: {$type: {n: {$type: Number, $scope: Scope.MASTER}}},
  //    a: {$type: Master.FixedArray, $elem: {n: {$type: Number, $scope: Scope.MASTER}}, $length: 3}
  //  }).$snapshot({includes: spy});
  //
  //  assert(spy.calledCount);
  //  //assert.property(o, 'n');
  //  //assert.notProperty(o, 's');
  //  //assert.property(o, 'b');
  //  //assert.notProperty(o, 'o');
  //});
});
