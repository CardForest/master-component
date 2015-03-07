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

module.exports = _Object;
