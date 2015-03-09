'use strict';

var FixedPropertyContainer = require('./fixedPropertyContainer');

function FixedArray(config, keyPath, changelog) {
  if (!config.$length || !config.$elem) {
    throw Error('FixedArray requires a configuration object with \'$length\' and \'$elem\' properties');
  }

  FixedPropertyContainer.call(this, keyPath, changelog, []);

  Object.defineProperty(this, 'length', {value: config.$length});

  var elemConfig = require('./util').normalize(config.$elem);
  for (var i = 0; i < config.$length; i++) {
    this.$raw.push(this.defineProperty(i, elemConfig));
  }

  Object.freeze(this);
};
FixedArray.prototype = Object.create(FixedPropertyContainer.prototype);

module.exports = FixedArray;
