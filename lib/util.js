"use strict";

var FixedObject = require('./fixedObject');
var FixedArray = require('./fixedArray');
var Component = require('./component');
var Scope = require('./scope');

function normalize(config) {
  if (config == null || (('$type' in config) && config.$type == null)) {
    throw Error('config element must be defined');
  }

  if (!('$type' in config)) {
    if (Array.isArray(config)) {
      // syntactic sugar - Array as:
      // arr: [{$type: Number, length: 30}]
      // instead of:
      // arr: {
      //    $type: FixedArray,
      //    $elem: Number,
      //    $length: 30
      //}
      if (config.length !== 1 ||
          config[0].constructor !== Object ||
          !config[0].$length) {
        throw Error('config array syntax must include exactly one element which contains a non-falsy \'length\' property');
      }
      config = {
        $type: FixedArray,
        $elem: config[0].$type,
        $length: config[0].$length
      };
      delete config.$elem.$length;
      return config;
    } else {
      // syntactic sugar - no $type
      config = {$type: config};
    }
  }

  if (config.$type.constructor === Object) {
    // syntactic sugar - object as type
    config.$schema = config.$type;
    config.$type = FixedObject;
    return config;
  }

  if (config.$type.prototype instanceof Component) {
    return config;
  }

  if (config.$type.constructor === Function) {
    config.$getter = config.$type.toString().lastIndexOf('function (', 0) === 0; // getters are anonymous functions
    config.$mutator = config.$type.toString().lastIndexOf('function $(', 0) === 0; // mutators are named as $
    config.$primitive = !(config.$getter || config.$mutator); // primitive are named functions
    return config;
  } else {
    throw Error('unrecognized type: ' + config.$type);
  }
}

function instantiate(config, keyPath, changelog) {
  if (config.$initialValue === Scope.HIDDEN) {
    return Scope.HIDDEN;
  } else if (config.$primitive) {
    return (config.$initialValue != null) ? config.$type(config.$initialValue) : config.$type();
  } else if (config.$getter || config.$mutator) {
    return config.$type; // nothing to instantiate
  } else {
    return new config.$type(config, keyPath, changelog);
  }
}

module.exports = {
  normalize: normalize,
  instantiate: instantiate
};
