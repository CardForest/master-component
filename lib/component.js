'use strict';

module.exports = function Component(config, keyPath, changelog) {
  Object.defineProperty(this, '$config', {value: config});
  Object.defineProperty(this, '$keyPath', {value: keyPath});
  Object.defineProperty(this, '$changelog', {value: changelog});
};
