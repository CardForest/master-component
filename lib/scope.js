'use strict';

var Scope = {
  PUBLIC: {
    includes: function(keyPath, config) {
      return !config.hasOwnProperty('$scope') || config.$scope === this;
    }
  },
  MASTER: {
    includes: function() {
      return true;
    }
  },
  HIDDEN: {$ref: 'HIDDEN'}
};

module.exports = Scope;
