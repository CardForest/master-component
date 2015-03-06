'use strict';

function MasterComponent(schemaEntry) {
  return MasterComponent.newInstance(MasterComponent.normalizeSchema(schemaEntry));
}

MasterComponent.newInstance = function(schemaEntry) {
  return (schemaEntry.$type.prototype instanceof MasterComponent) ?
    schemaEntry.$type.newInstance(schemaEntry) :
    schemaEntry.$type();
};

MasterComponent.normalizeSchema = function (schemaEntry) {
  if (schemaEntry == null || (('$type' in schemaEntry) && schemaEntry.$type == null)) {
    throw Error('schemaEntry element must be defined and have a defined $type');
  }
  if (!('$type' in schemaEntry)) {
    schemaEntry = {$type: schemaEntry};
  }

  if (schemaEntry.$type.constructor === Object) {
    // sub-object -> newInstance sure it has the MasterComponent.Object $type
    schemaEntry.$schema = schemaEntry.$type;
    schemaEntry.$type = MasterComponent.Object;
  }

  if (schemaEntry.$type.prototype instanceof MasterComponent) {
    // MasterComponent let it normalize itself
    return schemaEntry.$type.normalizeSchema(schemaEntry);
  }
  if (schemaEntry.$type.constructor === Function) {
    // factory functions -> normalize here
    return schemaEntry;
  }

  throw Error('unrecognized type: ' + schemaEntry.$type);
};

module.exports = MasterComponent;
