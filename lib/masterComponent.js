'use strict';

function MasterComponent() {}

MasterComponent._normalizeSchemaEntry = function (schemaEntry) {
  if (schemaEntry == null || (('$type' in schemaEntry) && schemaEntry.$type == null)) {
    throw Error('schemaEntry element must be defined and have a defined $type');
  }

  if (!('$type' in schemaEntry)) {
    // syntactic sugar - no $type
    schemaEntry = {$type: schemaEntry};
  }

  if (schemaEntry.$type.constructor === Object) {
    // syntactic sugar - object as type
    schemaEntry.$schema = schemaEntry.$type;
    schemaEntry.$type = MasterComponent.Object;
  }

  if (!(schemaEntry.$type.prototype instanceof MasterComponent)) {
    if (schemaEntry.$type.constructor === Function) {
      // syntactic sugar - factory object as type
      schemaEntry.$fn = schemaEntry.$type;
      schemaEntry.$type = MasterComponent.FactoryFunction;
    } else {
      throw Error('unrecognized type: ' + schemaEntry.$type);
    }
  }

  if (!('$snapshot' in schemaEntry)) {
    // default snapshot just return the same value
    schemaEntry.$snapshot = schemaEntry.$type.snapshot;
  } else if (!schemaEntry.$snapshot) {
    // snapshot is defined to a falsy value and should return undefined
    schemaEntry.$snapshot = function() {};
  } else if (schemaEntry.$snapshot.constructor !== Function) {
    throw Error('$snapshot must be either a falsy value or a function');
  }

  return schemaEntry;
}

MasterComponent._newInstance = function(schemaEntry) {
  var instance = schemaEntry.$type.newInstance(schemaEntry);
  Object.defineProperty(instance, '$snapshot', {
    value: schemaEntry.$snapshot,
    enumerable: false
  });
  return instance;
};

MasterComponent.newInstance = function(schemaEntry) {
  return MasterComponent._newInstance(MasterComponent._normalizeSchemaEntry(schemaEntry))
};


module.exports = MasterComponent;
