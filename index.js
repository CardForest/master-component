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
  newSlave: function(config, snapshot, channelToMaster, changeApplier) {
    if (snapshot == null) {
      throw Error('slave expects an initial snapshot value');
    }
    config = u.normalize(config);
    config.$initialValue = snapshot;
    var cl = new Changelog();
    cl.isSlave = true;
    cl.channelToMaster = channelToMaster;
    var res = u.instantiate(config, [],  cl);
    res.$changelog.applyChanges = changeApplier;
    return res;
  },
  FixedArray: require('./lib/fixedArray'),
  FixedObject: require('./lib/fixedObject'),
  Component: require('./lib/component')
  // TODO createClass(spec) -> new Class([snapshot])
};
