var assert = require('chai').assert;
var util = require('util');
var intuit = require('passport-intuit');

describe('passport-intuit', function() {
  it('should return a version', function() {
    assert.isString(intuit.version);
  })
});
