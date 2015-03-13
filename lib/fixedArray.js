'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');

function FixedArray(config, keyPath, changelog) {
  if (!config.$length || !config.$elem) {
    throw Error('FixedArray requires a configuration object with \'$length\' and \'$elem\' properties');
  }

  FixedPropertyContainer.call(this, keyPath, changelog, []);

  Object.defineProperty(this, 'length', {value: config.$length});

  var elemConfig = require('./util').normalize(config.$elem);

  if (elemConfig.$hidden) {
    Object.defineProperty(this, '$hiddenElements', {value: true});
  }

  for (var i = 0; i < config.$length; i++) {
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

module.exports = FixedArray;
