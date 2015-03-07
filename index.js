'use strict';


function _$protect(schema, master) {
  return function (params) {
    var res = {};
    for (var propertyName in master) {
      if (propertyName !== '$protect') {
        var readAccess = !('$readAccess' in schema[propertyName]) ||
                          ((schema[propertyName].$readAccess.constructor === Function) ?
                                schema[propertyName].$readAccess(params) :
                                schema[propertyName].$readAccess);
        if (readAccess) {
          var propertyVal = master[propertyName];
          res[propertyName] = (propertyVal.$protect && propertyVal.$protect.constructor === Function) ?
                                propertyVal.$protect() :
                                res[propertyName] = master[propertyName];
        }
      }
    }

    return res;
  };
}
function _Object(schema) {
  var res = {};
  for (var propertyName in schema) {
    res[propertyName] = _Type(schema[propertyName]);
  }

  res.$protect = _$protect(schema, res);
  return res;
}

function _MasterComponent() {

}
function _FixedSizeArray(config) {
  if (!config || !config.size || !config.elemType) {
    throw Error('FixedSizeArray requires a configuration object with \'size\' and \'elemType\' properties');
  }
  var res = new Array(config.size);
  for (var i = 0; i < config.size; i++) {
    res[i] = _Type(config.elemType);
  }
  return res;
}
_FixedSizeArray.prototype = Object.create(_MasterComponent.prototype);

//function _Array(type) {
//  var res = [];
//  res.initSize = function (size) {
//    for (var i = 0; i < size; i++) {
//      res.push(_Type(type));
//    }
//    return res;
//  };
//  return res;
//}

function _Type(type) { // jshint ignore:line
  var typeConfig;
  if (type && '$type' in type) {
    typeConfig = type;
    type = type.$type;
  }
  if (type == null) {
    throw Error('type must be defined');
  }

  if (type.prototype instanceof _MasterComponent) {
    return type(typeConfig);
  }

  if (type.constructor === Function) {
    //console.log('--- function');
    // factory functions
    return type();
  }
  if (type.constructor === Object) {
    //console.log('---- object');
    // sub-objects
    return _Object(type);
  }
  //if (Array.isArray(type)) {
  //  if (type.length !== 1) {
  //    throw Error('sub-array type must specify exactly one element');
  //  }
  //  // sub-arrays
  //  return _Array(type[0]);
  //}

  throw Error('unrecognized type: ' + type);
}

module.exports = {
  Object: _Object,
  //Array: _Array,
  FixedSizeArray: _FixedSizeArray
};
