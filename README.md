# Passport Intuit

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Intuit](http://intuit.com/) using the OAuth 2.0 API.

This module lets you authenticate using Intuit in your Node.js applications.
By plugging into Passport, Intuit authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```js
$ git+ssh://git@github.com/villarentals/passport-intuit.git

```

## Usage

#### Configure Strategy

The Intuit authentication strategy authenticates users using a Intuit
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client_id, scope, redirect_uri, and state.

```js
passport.use(new IntuitStrategy({
    clientID: '123abc',
    scope: 'com.intuit.quickbooks.accounting',
    redirect_uri: 'https://www.example.net/auth/intercom/callback',
    state: 'some state'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ intuitAccountId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'intuit'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/intuit',
  passport.authenticate('intuit', {state: 'some state'}));

app.get('/auth/intuit/return',
  passport.authenticate('intuit', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Tests

```bash
$ npm install --dev
$ make test
```
## License

[The MIT License](http://opensource.org/licenses/MIT)
