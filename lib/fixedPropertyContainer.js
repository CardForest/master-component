'use strict';
var KeyPath = require('key-path');
var Component = require('./component');

function FixedPropertyContainer(config, keyPath, changelog, raw){
  Component.call(this, config, keyPath, changelog);

  Object.defineProperty(this, '$raw', {value: raw});
}
FixedPropertyContainer.prototype = Object.create(Component.prototype);

FixedPropertyContainer.prototype.$$defineProperty = function (propertyKey, config) {
  var propertyKeyPath = this.$keyPath.slice(0);
  propertyKeyPath.push(propertyKey);

  var propertyDescriptor = {
    enumerable: true
  };

  propertyDescriptor.get = config.$getter ? config.$type : function () {return this.$raw[propertyKey];}

  if (config.$primitive) {
    propertyDescriptor.set = function (newValue) {
      if (typeof newValue !== typeof this.$raw[propertyKey]) {
        throw TypeError('only \'' + typeof this.$raw[propertyKey] + // jshint ignore:line
        '\' values can be assigned to ' + KeyPath.get(propertyKeyPath));
      }
      this.$raw[propertyKey] = newValue;
      this.$changelog.setPrimitiveValue(config.$hidden, propertyKeyPath, newValue);
    };
  } else if (config.$type.$setter) {
    propertyDescriptor.set = function (newValue) {
      config.$type.$setter.call(this.$raw[propertyKey], newValue);
    };
  }

  Object.defineProperty(this, propertyKey, propertyDescriptor);

  return require('./util').instantiate(config, propertyKeyPath, this.$changelog);
};
Object.defineProperty(FixedPropertyContainer.prototype, '$$defineProperty', {enumerable: false});

FixedPropertyContainer.prototype.$$snapshotProperty = function (propertyKey, config, scope) {
  if (scope == null || scope.includes(this.$keyPath.concat(propertyKey), config)) {
    if (config.$primitive) {
      return this.$raw[propertyKey];
    } else if (('$snapshot' in this.$raw[propertyKey])) {
      return this.$raw[propertyKey].$snapshot(scope);
    } // else functions or non-serializable component
  }
};
Object.defineProperty(FixedPropertyContainer.prototype, '$$snapshotProperty', {enumerable: false});

FixedPropertyContainer.prototype.$$copyPropertyToView = function(propertyName, revealPaths, hidden, view) {
  var derivedRevealPaths = [];

  for (var i = 0; i < revealPaths.length; i++) {
    if (revealPaths[i][0] == propertyName) { // jshint ignore:line
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
    view[propertyName] = (this.$raw[propertyName] instanceof Component) ?
              this.$raw[propertyName].$view(derivedRevealPaths) :
              view[propertyName] = this.$raw[propertyName];
  }
};
Object.defineProperty(FixedPropertyContainer.prototype, '$$copyPropertyToView', {enumerable: false});

module.exports = FixedPropertyContainer;
