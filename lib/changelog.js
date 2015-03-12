'use strict';

function Changelog() {}

var KeyPath = require('key-path');
Changelog.prototype = {
  __proto__: [],

  reset: function() {
    this.length = 0;
  },

  view: function () {
    var revealPaths =  KeyPath.getAll.apply(KeyPath, arguments);

    return this.filter(function (change, index) {

      if (change.hidden) {
        for (var i = 0; i < revealPaths.length; i++) {
          if (revealPaths[i] === KeyPath.get(KeyPath.get(change.payload[0]).toString())) { // TODO this check should be delegate to a change typw and not depend on payload
            // hidden and revealed
            return true;
          }
        }
        // hidden
        return false;
      } else {
        // not hidden
        return true;
      }
    });
  }
}

var changeNames = [
  'setPrimitiveValue' // keyPath, newValue
];

changeNames.forEach(function (changeName) {
  Changelog.prototype[changeName] = function() {
    var change = {
      type: changeName,
      payload: [].slice.call(arguments, 1) // (converts arguments into an array
    };
    if (arguments[0]) {
      change.hidden = true;
    }
    this.push(change);
  };
});

module.exports = Changelog;
//
//var Master = require('..')
//var o = Master.newInstance({
//  n: Number,
//  s: {$type: String, $hidden: true},
//  b: Boolean
//});
//
//o.n = 2;
//o.s = 'some value';
//o.b = true;
//
//var cv = o.$changelog.view();
