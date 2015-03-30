'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');

function FixedObject(config, keyPath, changelog) {
  FixedPropertyContainer.call(this, config, keyPath, changelog, {});

  Object.defineProperty(this, '$hiddenProperties', {value: {}});
  for (var propertyName in config.$schema) {
    var propertyConfig = require('./util').normalize(config.$schema[propertyName]);
    if (config.hasOwnProperty('$initialValue') && config.$initialValue.hasOwnProperty(propertyName)) {
      propertyConfig.$initialValue = config.$initialValue[propertyName];
    }

    config.$schema[propertyName] = propertyConfig; // update with the normalized config

    if (propertyConfig.$hidden) {
      this.$hiddenProperties[propertyName] = true;
    }

    this.$raw[propertyName] = this.$$defineProperty(propertyName, propertyConfig);
  }

  Object.freeze(this);
}
FixedObject.prototype = Object.create(FixedPropertyContainer.prototype);

var KeyPath = require('key-path');
FixedObject.prototype.$view = function () {
  var revealPaths =  KeyPath.getAll.apply(KeyPath, arguments);
  var res = {};

  for (var propertyName in this.$raw) {
    this.$$copyPropertyToView(propertyName, revealPaths, !!this.$hiddenProperties[propertyName], res);
  }

  return Object.freeze(res);
};
Object.defineProperty(FixedObject.prototype, '$view', {enumerable: false});

FixedObject.prototype.$snapshot = function () {
  var res = {};
  var self = this;
  Object.keys(this.$config.$schema).forEach(function (propertyKey) {
    var serialized = self.$$snapshotProperty(propertyKey, self.$config.$schema[propertyKey]);
    if (serialized != null) {
      res[propertyKey] = serialized;
    }
  });
  return res;
};
Object.defineProperty(FixedObject.prototype, '$snapshot', {enumerable: false});

module.exports = FixedObject;
