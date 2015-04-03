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

  it('default and MASTER snapshots return everything', function () {
    var o = Master.newInstance({
      n: {$type: Number, $scope: Scope.PUBLIC},
      s: {$type: String, $scope: 'customScope'},
      b: {$type: Boolean},
      o: {$type: {n: {$type: Number, $scope: Scope.MASTER}}, $scope: Scope.MASTER},
      a: {$type: Master.FixedArray, $elem: {n: {$type: Number, $scope: Scope.MASTER}}, $length: 3}
    });

    var expected = {
      n: 0,
      s: '',
      b: false,
      o: {n: 0},
      a: [{n: 0}, {n: 0}, {n: 0}]
    };

    assert.deepEqual(o.$snapshot(), expected);
    assert.deepEqual(o.$snapshot(Scope.MASTER), expected);
  });

  it('snapshot with public scope return only properties with default or public scope', function () {
    var s = Master.newInstance({
      n: {$type: Number, $scope: Scope.PUBLIC},
      s: {$type: String, $scope: 'customScope'},
      b: {$type: Boolean},
      o: {$type: {n: {$type: Number, $scope: Scope.MASTER}}},
      a: {$type: Master.FixedArray, $elem: {n: {$type: Number, $scope: Scope.MASTER}}, $length: 3}
    }).$snapshot(Scope.PUBLIC);

    assert.deepEqual(s, {
      n: 0,
      b: false,
      o: {},
      a: [{}, {}, {}]
    });
  });

  it('snapshot with custom scope can control what they return', function () {
    var spy = sinon.spy(function(_, config) {
      return config.hasOwnProperty('$scope') && config.$scope === 'customScope'
    });

    var s = Master.newInstance({
      n: {$type: Number, $scope: Scope.PUBLIC},
      s: {$type: String, $scope: 'customScope'},
      b: {$type: Boolean},
      o: {$type: {n: {$type: Number, $scope: Scope.MASTER}}},
      a: {$type: Master.FixedArray, $elem: {n: {$type: Number, $scope: Scope.MASTER}}, $length: 3}
    }).$snapshot({includes: spy});

    assert.strictEqual(spy.callCount, 5); // (it doesn't enter the array and object sub elements)
    assert(spy.calledWith(['s'], {$getter: false, $primitive: true, $scope: 'customScope', $type: String}));

    assert.deepEqual(s, {
      s: '',
    });
  });

  // TODO move this a new npm module
  it('supports a player scope use case', function () {
    var PLAYER_SCOPE = function(playerIdx) {
      if (this === undefined) {
        return new PLAYER_SCOPE(playerIdx);
      }
      this.playerIdx = playerIdx;
    };
    PLAYER_SCOPE.prototype.includes = function (keyPath, config) {
      if (!config.hasOwnProperty('$scope')) {
        return true;
      }

      if (config.$scope === PLAYER_SCOPE) {
        if (keyPath[0] !== 'players') {
          // TODO consider how to fail early when creating the master object instead of in player snapshot time
          throw Error('the PLAYER scope should only be nested inside a top level players array');
        } else {
          return (keyPath[1] === this.playerIdx);
        }
      } else {
        return config.$scope === Scope.PUBLIC;
      }
    };

    var s = Master.newInstance({
      n: {$type: Number, $scope: Scope.PUBLIC},
      b: {$type: Boolean},
      o: {$type: {n: {$type: Number, $scope: Scope.MASTER}}},
      players: {
        $type: Master.FixedArray,
        $length: 3,
        $elem: {
          playerSecret: {
            $type: Number,
            $initialValue: 42,
            $scope: PLAYER_SCOPE
          },
          playerPub: {
            $type: Number
          }
        }
      }
    }).$snapshot(PLAYER_SCOPE(1));

    assert.deepEqual(s, {
      n: 0,
      b: false,
      o: {},
      players: [
        {playerPub: 0},
        {playerPub: 0, playerSecret: 42},
        {playerPub: 0}
      ]
    });
  });
});
