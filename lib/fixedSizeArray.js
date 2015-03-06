'use strict';

var MasterComponent = require('./masterComponent');

function FixedSizeArray() {};
FixedSizeArray.prototype = Object.create(MasterComponent.prototype);

FixedSizeArray.newInstance = function(schemaEntry) {
  var res = new Array(schemaEntry.size);
  for (var i = 0; i < schemaEntry.size; i++) {
    res[i] = MasterComponent.newInstance(schemaEntry.elemType);
  }

  return res;
};

FixedSizeArray.normalizeSchema = function(schemaEntry) {
  if (!schemaEntry.size || !schemaEntry.elemType) {
    throw Error('FixedSizeArray requires a configuration object with \'size\' and \'elemType\' properties');
  }
  schemaEntry.elemType = MasterComponent.normalizeSchema(schemaEntry.elemType);
  return schemaEntry;
};

module.exports = FixedSizeArray;
