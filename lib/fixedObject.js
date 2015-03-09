'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');
var Component = require('./component');

function FixedObject(config, keyPath, changelog) {
  FixedPropertyContainer.call(this, keyPath, changelog, {});

  this.$hiddenProperties = {};
  for (var propertyName in config.$schema) {
    var propertyConfig = require('./util').normalize(config.$schema[propertyName]);

    if (propertyConfig.$hidden) {
      this.$hiddenProperties[propertyName] = true;
    }


    this.$raw[propertyName] = this.defineProperty(propertyName, propertyConfig);
  }

  Object.freeze(this);
}
FixedObject.prototype = Object.create(FixedPropertyContainer.prototype);

FixedObject.prototype.$view = function () {
  var res = {};
  for (var propertyName in this.$raw) {
    if (!this.$hiddenProperties[propertyName]) {
      if (this.$raw[propertyName] instanceof Component) {
        res[propertyName] = this.$raw[propertyName].$view();
      } else {
        res[propertyName] = this.$raw[propertyName];
      }
    }
  }

  return Object.freeze(res);
}

module.exports = FixedObject;
