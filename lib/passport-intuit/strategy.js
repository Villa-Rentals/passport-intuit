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
 *   - `callbackURL`   URL to which Intuit will redirect the user after granting authorization
 *   - `state`          State that might be helpful for your purposes
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
  options.tokenURL = options.tokenURL || 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  options.response_type = options.response_type || 'code'
  options.grant_type = options.grant_type ||'authorization_code'

  OAuth2Strategy.call(this, options, verify);
  this.name = 'intuit';

  this.redirect_uri = options.callbackURL
  this._oauth2.useAuthorizationHeaderforGET(true);
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  done(null, accessToken)
};

// Expose constructor.
module.exports = Strategy;
