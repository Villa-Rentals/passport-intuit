// Load modules.
var util = require('util'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  InternalOAuthError = require('passport-oauth').InternalOAuthError,
  pjson = require('../../package.json');

/**
 * `Strategy` constructor.
 *
 * The Intuit authentication strategy authenticates requests by delegating to
 * Intuit using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Intuit applicaiton's App ID
 *   - `scope`          the API's you plan to access (com.intuit.quickbooks.accounting, com.intuit.quickbooks.payment)
 *   - `redirect_uri`   URL to which Intuit will redirect the user after granting authorization
 *   - `state`          Provides any state that might be useful to your application upon receipt of the response
 *
 * Examples:
 *
 *     passport.use(new IntercomStrategy({
 *         clientID: '123abc',
 *         scope: 'com.intuit.quickbooks.accounting',
 *         redirect_uri: 'https://www.example.net/auth/intercom/callback',
 *         state: 'some state'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://appcenter.intuit.com/connect/oauth2';
  options.tokenURL = options.tokenURL || 'https://github.com/login/oauth/access_token';
  options.response_type = options.response_type || 'code'

  OAuth2Strategy.call(this, options, verify);
  this.name = 'intuit';

  this.redirect_uri = options.redirect_uri
  this._oauth2.useAuthorizationHeaderforGET(true);
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(code, done) {
  this._oauth2._customHeaders.Accept = "application/json";
  this._oauth2.useAuthorizationHeaderforGET(true);
  this._oauth2.setAuthMethod("Basic");

  var options = {
    code: code,
    redirect_uri: this.redirect_uri,
    grant_type: 'authorization_code'
  }

  this._oauth2.get('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer ', options, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err));
    }

    var json;

    try {
      json = JSON.parse(body);
    } catch(e) {
      return done(e);
    }

    done(null, json);
  });
};

// Expose constructor.
module.exports = Strategy;
