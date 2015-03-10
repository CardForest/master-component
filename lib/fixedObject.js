'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');
var Component = require('./component');

function FixedObject(config, keyPath, changelog) {
  FixedPropertyContainer.call(this, keyPath, changelog, {});

  Object.defineProperty(this, '$hiddenProperties', {value: {}});
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

var KeyPath = require('key-path');
FixedObject.prototype.$view = function () {
  var revealPaths =  KeyPath.getAll.apply(KeyPath, arguments);
  var res = {};

  for (var propertyName in this.$raw) {
    var hidden = this.$hiddenProperties[propertyName];
    var derivedRevealPaths = [];

    for (var i = 0; i < revealPaths.length; i++) {
      if (revealPaths[i][0] == propertyName) {
        if (revealPaths[i].length === 1) {
          // this path is revealed
          hidden = false;
        } else {
          // this path is a prefix
          derivedRevealPaths.push(revealPaths[i].slice(1));
        }
      }
    }
    if (!hidden) {
      if (this.$raw[propertyName] instanceof Component) {
        res[propertyName] = this.$raw[propertyName].$view(derivedRevealPaths);
      } else {
        res[propertyName] = this.$raw[propertyName];
      }
    }

  }

  return Object.freeze(res);
}

module.exports = FixedObject;
