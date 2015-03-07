'use strict';

var MasterComponent = require('./masterComponent');

function FactoryFunction() {};
FactoryFunction.prototype = Object.create(MasterComponent.prototype);

FactoryFunction.newInstance = function(schemaEntry) {
  return ('$value' in schemaEntry) ?
     new schemaEntry.$fn(schemaEntry.$value) :
     new schemaEntry.$fn();
};

FactoryFunction.snapshot = function() {return this;};

module.exports = FactoryFunction;
