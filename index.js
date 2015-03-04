'use strict';

function _Object(schema) {
  var res = {};
  for (var property in schema) {
    res[property] = _Type(schema[property]);
  }
  return res;
}

function _Array(type) {
  var res = [];
  res.initSize = function (size) {
    for (var i = 0; i < size; i++) {
      res.push(_Type(type));
    }
    return res;
  };
  return res;
}

function _Type(type) { // jshint ignore:line
  if (type == null) {
    throw Error('type must not be null');
  }
  if (type.constructor === Function) {
    // factory functions
    return type();
  }
  if (type.constructor === Object) {
    // sub-objects
    return _Object(type);
  }
  if (Array.isArray(type)) {
    if (type.length !== 1) {
      throw Error('sub-array type must specify exactly one element');
    }
    // sub-arrays
    return _Array(type[0]);
  }

  throw Error('unrecognized type: ' + type);
}

module.exports = {
  Object: _Object,
  Array: _Array
};
