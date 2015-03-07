'use strict';

var MasterComponent = require('./masterComponent');

function FactoryFunction() {};
FactoryFunction.prototype = Object.create(MasterComponent.prototype);

FactoryFunction.newInstance = function(schemaEntry) {
  return schemaEntry.$fn();
};

module.exports = FactoryFunction;
