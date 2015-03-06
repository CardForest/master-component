'use strict';

var MasterComponent = require('./masterComponent');

function _Object() {};
_Object.prototype = Object.create(MasterComponent.prototype);

_Object.newInstance = function(schemaEntry) {
  var res = {};
  for (var propertyName in schemaEntry.$schema) {
    res[propertyName] = MasterComponent.newInstance(schemaEntry.$schema[propertyName]);
  }

  return res;
};
_Object.normalizeSchema = function(schemaEntry) {
  for (var propertyName in schemaEntry.$schema) {
    schemaEntry.$schema[propertyName] = MasterComponent.normalizeSchema(schemaEntry.$schema[propertyName]);
  }
  return schemaEntry;
};


module.exports = _Object;
