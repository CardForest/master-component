'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');

function FixedObject(config, keyPath, changelog) {
  FixedPropertyContainer.call(this, keyPath, changelog, {});

  Object.defineProperty(this, '$hiddenProperties', {value: {}});
  for (var propertyName in config.$schema) {
    var propertyConfig = require('./util').normalize(config.$schema[propertyName]);

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

module.exports = FixedObject;
