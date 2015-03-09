'use strict';
var KeyPath = require('key-path');
var Component = require('./component');

function FixedPropertyContainer(keyPath, changelog, raw){
  Object.defineProperty(this, '$keyPath', {value: keyPath});
  Object.defineProperty(this, '$changelog', {value: changelog});
  Object.defineProperty(this, '$raw', {value: raw});
}
FixedPropertyContainer.prototype = Object.create(Component.prototype);

FixedPropertyContainer.prototype.defineProperty = function (propertyKey, config) {
  var propertyKeyPath = this.$keyPath.slice(0);
  propertyKeyPath.push(propertyKey);

  var propertyDescriptor = {
    get: function () {
      return this.$raw[propertyKey];
    },
    enumerable: true
  };

  if (config.$primitive) {
    propertyDescriptor.set = function (newValue) {
      if (typeof newValue != typeof this.$raw[propertyKey]) {
        throw TypeError('only \'' + typeof this.$raw[propertyKey] + '\' values can be assigned to ' + KeyPath.get(propertyKeyPath))
      }
      this.$raw[propertyKey] = newValue;
      this.$changelog.setPrimitiveValue(propertyKeyPath, newValue);
    }
  }

  Object.defineProperty(this, propertyKey, propertyDescriptor);

  return require('./util').instantiate(config, propertyKeyPath, this.$changelog);
}

module.exports = FixedPropertyContainer;
