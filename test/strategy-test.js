var assert = require('chai').assert;
var util = require('util');
var IntuitStrategy = require('passport-intuit/strategy');

describe('IntuitStrategy', function() {
  it('strategy', function() {
    let strategy = new IntuitStrategy({
      clientID: '123abc',
      scope: 'com.intuit.quickbooks.accounting',
      redirect_uri: 'https://www.example.net/auth/intuit/return',
      state: 'some state'
    },
    function() {})

    assert.equal(strategy.name, 'intuit');
  })
  describe('strategy when loading user profile', function() {
    var strategy

    before(function(done) {
      strategy = new IntuitStrategy({
        clientID: '123abc',
        scope: 'com.intuit.quickbooks.accounting',
        redirect_uri: 'https://www.example.net/auth/intuit/return',
        state: 'some state'
      },
      function() {});

      // mock
      strategy._oauth2.get = function(url, params, callback) {
        var body = 'access-token';
        callback(null, body, undefined);
      }

      done()
    })

    describe('when told to load user profile', function() {
      it('should not error', function() {
        var self = this;
        function finished(err, json) {
          assert.isNull(err);
        }

        process.nextTick(function () {
          strategy.userProfile('access-token', finished);
        });
      })
      it('should load json', function() {
        var self = this;
        function finished(err, json) {
          assert.equal(json, 'access-token');
        }

        process.nextTick(function () {
          strategy.userProfile('access-token', finished);
        });
      })
    })
  })
})
