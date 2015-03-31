'use strict';

var assert = require('chai').assert;
//var Master = require('..');

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
});
