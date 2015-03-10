'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');
var Component = require('./component');

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
    this.$raw.push(this.defineProperty(i, elemConfig));
  }

  Object.freeze(this);
};
FixedArray.prototype = Object.create(FixedPropertyContainer.prototype);

var KeyPath = require('key-path');
FixedArray.prototype.$view = function () {
  var revealPaths =  KeyPath.getAll.apply(KeyPath, arguments);

  var res = [];
  res.length = this.length;
  for (var i = 0; i < this.length; i++) {
    var hidden = this.$hiddenElements;
    var derivedRevealPaths = [];

    for (var j = 0; j < revealPaths.length; j++) {
      if (revealPaths[j][0] == i) {
        if (revealPaths[j].length === 1) {
          // this path is revealed
          hidden = false;
        } else {
          // this path is a prefix
          derivedRevealPaths.push(revealPaths[j].slice(1));
        }
      }
    }

    if (!hidden) {
      if (this.$raw[i] instanceof Component) {
        res[i] = this.$raw[i].$view(derivedRevealPaths);
      } else {
        res[i] = this.$raw[i];
      }
    }
  }

  return Object.freeze(res);
}

module.exports = FixedArray;
