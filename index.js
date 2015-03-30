"use strict";

var Changelog = require('./lib/changelog');
var u = require('./lib/util');

module.exports = {
  newInstance: function(config) {
    return u.instantiate(u.normalize(config), [],  new Changelog());
  },
  restore: function(config, snapshot) {
    config = u.normalize(config);
    config.$initialValue = snapshot;
    return u.instantiate(config, [],  new Changelog());
  },
  FixedArray: require('./lib/fixedArray'),
  FixedObject: require('./lib/fixedObject'),
  Component: require('./lib/component')
};
