'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');

function FixedArray(config, keyPath, changelog) {
  if (!config.$length || !config.$elem) {
    throw Error('FixedArray requires a configuration object with \'$length\' and \'$elem\' properties');
  }

  FixedPropertyContainer.call(this, config, keyPath, changelog, []);

  Object.defineProperty(this, 'length', {value: config.$length});

  var elemConfig = require('./util').normalize(config.$elem);
  config.$elem = elemConfig; // update with the normalized config

  if (elemConfig.$hidden) {
    Object.defineProperty(this, '$hiddenElements', {value: true});
  }

  for (var i = 0; i < config.$length; i++) {
    if (config.hasOwnProperty('$initialValue') && (config.$initialValue[i] != null)) {
      elemConfig.$initialValue = config.$initialValue[i];
    }
    this.$raw.push(this.$$defineProperty(i, elemConfig));
  }

  Object.freeze(this);
}
FixedArray.prototype = Object.create(FixedPropertyContainer.prototype);

var KeyPath = require('key-path');
FixedArray.prototype.$view = function () {
  var revealPaths =  KeyPath.getAll.apply(KeyPath, arguments);
  var res = [];
  res.length = this.length;

  for (var i = 0; i < this.length; i++) {
    this.$$copyPropertyToView(i, revealPaths, !!this.$hiddenElements, res);
  }

  return Object.freeze(res);
};
Object.defineProperty(FixedArray.prototype, '$view', {enumerable: false});

FixedArray.prototype.$snapshot = function () {
  var res = [];
  for (var i = 0; i < this.$config.$length; i++) {
    var serialized = this.$$snapshotProperty(i, this.$config.$elem);
    if (serialized == null) {
      // it doesn't really make sense for some elements of the array to not be serializable
      // if they are -> the array is not serializable
      return;
    }
    res.push(serialized);
  }
  return res;
};
Object.defineProperty(FixedArray.prototype, '$snapshot', {enumerable: false});

module.exports = FixedArray;
