'use strict';

var MasterComponent = require('./masterComponent');

function FixedSizeArray() {};
FixedSizeArray.prototype = Object.create(MasterComponent.prototype);

FixedSizeArray.newInstance = function(schemaEntry) {
  if (!schemaEntry.size || !schemaEntry.elemType) {
    throw Error('FixedSizeArray requires a configuration object with \'size\' and \'elemType\' properties');
  }

  var res = new Array(schemaEntry.size);
  for (var i = 0; i < schemaEntry.size; i++) {
    res[i] = MasterComponent.newInstance(schemaEntry.elemType);
  }

  return res;
};

FixedSizeArray.snapshot = function() {
  var res = new Array(this.length);
  for (var i = 0; i < this.length; i++) {
    var elemSnapshot = this[i].$snapshot();
    if (elemSnapshot != null) {
      res[i] = elemSnapshot;
    }
  }
  return res;
}

module.exports = FixedSizeArray;
