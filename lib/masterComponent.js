'use strict';

function normalizeSchemaEntry(schemaEntry) {
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

  return schemaEntry;
}

function MasterComponent() {}
MasterComponent.newInstance = function(schemaEntry) {
  schemaEntry = normalizeSchemaEntry(schemaEntry);
  return schemaEntry.$type.newInstance(schemaEntry);
};

module.exports = MasterComponent;
