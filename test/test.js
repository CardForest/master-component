'use strict';
var assert = require('assert');
var masterComponent = require('../');

describe('master-component node module', function () {
  it('must have at least one test', function () {
    masterComponent();
    assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
