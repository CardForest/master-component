'use strict';

function Changelog() {}

Changelog.prototype = {
  __proto__: [],

  reset: function() {
    this.length = 0;
  }
}

var changeNames = [
  'setPrimitiveValue' // keyPath, newValue
];

changeNames.forEach(function (changeName) {
  Changelog.prototype[changeName] = function() {
    this.push({
      name: changeName,
      args: [].slice.call(arguments) // (converts arguments into an array
    })
  };
});

module.exports = Changelog;
