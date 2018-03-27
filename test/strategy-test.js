var assert = require('chai').assert;
var util = require('util');
var IntuitStrategy = require('passport-intuit/strategy');

describe('IntuitStrategy', function() {
  it('strategy', function() {
    let strategy = new IntuitStrategy({
      clientID: '123abc',
      scope: 'com.intuit.quickbooks.accounting',
      redirect_uri: 'https://www.example.net/auth/intuit/return'
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
        redirect_uri: 'https://www.example.net/auth/intuit/return'
      },
      function() {});

      // mock
      strategy._oauth2.get = function(url, params, callback) {
        var body = ' \
          { \
            "some_key": "some_value", \
            "some_key1": "some_value1", \
            "some_key2": "some_value2", \
            "some_key3": "some_value3" \
          } \
        ';
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
          assert.equal(json.some_key, 'some_value');
          assert.equal(json.some_key1, 'some_value1');
        }

        process.nextTick(function () {
          strategy.userProfile('access-token', finished);
        });
      })
    })
  })
  describe('strategy when loading user profile and encountering an error', function() {
    describe('when told to load user profile', function() {
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
        strategy._oauth2.get = function(url, accessToken, callback) {
          callback(new Error('something-went-wrong'));
        }

        done()
      })

      describe('when told to load json', function() {
        it('should error', function() {
          var self = this;
          function finished(err, json) {
            assert.isNotNull(err);
          }

          process.nextTick(function () {
            strategy.userProfile('access-token', finished);
          });
        })
        it('should wrap error in InternalOAuthError', function() {
          var self = this;
          function finished(err, json) {
            assert.equal(err.constructor.name, 'InternalOAuthError');
          }

          process.nextTick(function () {
            strategy.userProfile('access-token', finished);
          });
        })
        it('should not load json', function() {
          var self = this;
          function finished(err, json) {
            assert.isUndefined(json);
          }

          process.nextTick(function () {
            strategy.userProfile('access-token', finished);
          });
        })
      })
    })
  })
})
