import express from 'express'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'

import User from '../models/users'

const app = module.exports = express.Router();

// Configure the Twitter strategy for use by Passport.
//
// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	process.nextTick(function() {
  		console.log(profile);
        // check user table for anyone with a facebook ID of profile.id
        User.findOne({
            'github.id': profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    username: profile.username,
                    provider: 'github'
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
      });;
    }
));

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });

// // Use application-level middleware for common functionality, including logging, parsing, and session handling.
// app.use(require('morgan')('combined'));
// //app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// //app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// // Initialize Passport and restore authentication state, if any, from the session.
// app.use(passport.initialize());
// app.use(passport.session());


// // Define routes.
// app.get('/login',
//   function(req, res){
//     res.send('login sucess!')
//   });

// app.get('/login/twitter',
//   passport.authenticate('twitter'));

// app.get('/login/twitter/return', 
//   passport.authenticate('twitter', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

// // app.get('/profile',
// //   require('connect-ensure-login').ensureLoggedIn(),
// //   function(req, res){
// //     res.render('profile', { user: req.user });
// //   });
