'use strict';

var MasterComponent = require('./masterComponent');

function _Object() {};
_Object.prototype = Object.create(MasterComponent.prototype);

_Object.newInstance = function(schemaEntry) {
  var raw = {};
  var res = {};
  for (var propertyName in schemaEntry.$schema) {
    var propSchemaEntry = MasterComponent._normalizeSchemaEntry(schemaEntry.$schema[propertyName]);
    raw[propertyName] = MasterComponent._newInstance(propSchemaEntry);

    (function (propertyName, propSchemaEntry) {
      Object.defineProperty(res, propertyName, {
        get: function() {return raw[propertyName];},
        set: function(newValue) {
          propSchemaEntry.$value = newValue;
          raw[propertyName] = MasterComponent._newInstance(propSchemaEntry);
        },
        enumerable: true
      });
    })(propertyName, propSchemaEntry);
  }

  return res;
};

_Object.snapshot = function(params) {

  var res = {};
  for (var propertyName in this) {
    var propSnapshot = this[propertyName].$snapshot(params);
    if (propSnapshot != null) {
      res[propertyName] = propSnapshot;
    }
  }
  return res;
}

module.exports = _Object;
