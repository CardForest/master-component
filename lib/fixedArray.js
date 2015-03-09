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
    this.$hiddenElements = true;
  }

  for (var i = 0; i < config.$length; i++) {
    this.$raw.push(this.defineProperty(i, elemConfig));
  }

  Object.freeze(this);
};
FixedArray.prototype = Object.create(FixedPropertyContainer.prototype);

FixedArray.prototype.$view = function () {
  var res = [];
  res.length = this.length;
  if (!this.$hiddenElements) {
    for (var i = 0; i < this.length; i++) {
      if (this.$raw[i] instanceof Component) {
        res[i] = this.$raw[i].$view();
      } else {
        res[i] = this.$raw[i];
      }
    }
  }

  return Object.freeze(res);
}

module.exports = FixedArray;
