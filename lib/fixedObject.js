'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');

function FixedObject(config, keyPath, changelog) {
  FixedPropertyContainer.call(this, keyPath, changelog, {});

  for (var propertyName in config.$schema) {
    var propertyConfig = require('./util').normalize(config.$schema[propertyName]);

    this.$raw[propertyName] = this.defineProperty(propertyName, propertyConfig);
  }

  Object.freeze(this);
}
FixedObject.prototype = Object.create(FixedPropertyContainer.prototype);

module.exports = FixedObject;
