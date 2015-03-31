"use strict";

var Changelog = require('./lib/changelog');
var u = require('./lib/util');

module.exports = {
  newInstance: function(config, snapshot) {
    config = u.normalize(config);
    if (snapshot != null) {
      config.$initialValue = snapshot;
    }
    return u.instantiate(config, [],  new Changelog());
  },
  FixedArray: require('./lib/fixedArray'),
  FixedObject: require('./lib/fixedObject'),
  Component: require('./lib/component')
  // TODO createClass(spec) -> new Class([snapshot])
};
