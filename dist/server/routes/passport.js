'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportGithub = require('passport-github2');

var _passportGithub2 = _interopRequireDefault(_passportGithub);

var _passportTwitter = require('passport-twitter');

var _passportTwitter2 = _interopRequireDefault(_passportTwitter);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _jwtConfig = require('../jwt-config');

var _jwtConfig2 = _interopRequireDefault(_jwtConfig);

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = module.exports = _express2.default.Router();

function createToken(username) {
  return _jsonwebtoken2.default.sign({ user: username }, _jwtConfig2.default, { expiresIn: 60 * 60 });
}

// define GitHub strategy
_passport2.default.use(new _passportGithub2.default({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_PROD
}, function (accessToken, refreshToken, profile, done) {
  console.log(profile);
  // search for user in database base on id = GitHub email address as unique identification
  _users2.default.findOne({ id: profile.emails[0].value }, function (err, user) {
    // handle error
    if (err) {
      return done(err);
    }
    // if there is no user with this email, create a new one
    if (!user) {
      user = new _users2.default({
        id: profile.emails[0].value,
        displayName: profile.displayName,
        username: profile.username,
        password: '',
        githubId: profile.id,
        twitterId: '',
        userData: []
      });
      user.save(function (err) {
        if (err) console.log(err);
        return done(err, user);
      });
      // if user already has an account with this email, add their github ID  
    } else if (profile.emails[0].value === user.id) {
      user.githubId = profile.id;
      user.save(function (err) {
        if (err) console.log(err);
        return done(err, user);
      });
      // user has logged in before, return user and proceed
    } else {
      console.log('user,', user);
      return done(err, user);
    }
  });
}));

// request for GitHub authentication
app.get('/auth/github', _passport2.default.authenticate('github'));

// GitHub callback
app.get('/auth/github/callback', _passport2.default.authenticate('github', { failureRedirect: '/login' }), function (req, res) {
  // Successful authentication, redirect to for client to continue auth process
  res.redirect('/account');
});

// define Twitter strategy
_passport2.default.use(new _passportTwitter2.default({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: "/auth/twitter/callback"
}, function (accessToken, refreshToken, profile, done) {
  // search database based on twitter profile ID because twitter API does not provide email
  _users2.default.findOne({ twitterId: profile.id }, function (err, user) {
    //handle error
    if (err) {
      return done(err);
    }
    // if user has not logged in through twitter before, create a new user        
    if (!user) {
      user = new _users2.default({
        id: '',
        displayName: profile.displayName,
        username: profile.username,
        password: '',
        githubId: '',
        twitterId: profile.id,
        userData: []
      });
      user.save(function (err) {
        if (err) console.log(err);
        return done(err, user);
      });
      // if user has logged in through twitter before, let them proceed 
    } else {
      console.log('user,', user);
      return done(err, user);
    }
  });
}));

// request for Twitter authentication
app.get('/auth/twitter', _passport2.default.authenticate('twitter'));

// Twitter callback
app.get('/auth/twitter/callback/', _passport2.default.authenticate('twitter', { failureRedirect: '/login' }), function (req, res) {
  // Successful authentication, redirect to for client to continue auth process
  res.redirect('/account');
});

// client verifies auth flow from passport redirect are receives jwt token in response or redirects to login page otherwise
app.post('/verify', function (req, res) {
  console.log('user:', req.user.id);
  // if user is authenticated send them a jwt token
  if (req.isAuthenticated()) {
    res.status(201).send({
      id_token: createToken(req.user.username),
      user_id: req.user.id,
      user: req.user.username
    });
    // if session is not authenticated redirect to login
  } else {
    res.redirect('/login');
  }
});

// handle logout in passport
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});