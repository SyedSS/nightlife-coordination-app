import express from 'express'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import TwitterStrategy from 'passport-twitter'
import jwt from 'jsonwebtoken'
import secret from '../jwt-config'

import User from '../models/users'

const app = module.exports = express.Router();

function createToken(username) { return jwt.sign({user: username}, secret, { expiresIn: 60 * 60 }) }

// define GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
        User.findOne({
            id: profile.emails[0].value 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    id: profile.emails[0].value,
                    displayName: profile.displayName,
                    username: profile.username,
                    password: '',
                    githubId: profile.id,
                    twitterId: ''
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                console.log('user,', user);
                return done(err, user);
            }
        });
   }
));

// request for GitHub authentication
app.get('/auth/github', passport.authenticate('github'));

// GitHub callback
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to for client to continue auth process
		res.redirect('/account');
});


// define GitHub strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
        User.findOne({
            id: profile.emails[0].value 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    id: profile.emails[0].value,
                    displayName: profile.displayName,
                    username: profile.username,
                    password: '',
                    githubId: '',
                    twitterId: profile.id,
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                console.log('user,', user);
                return done(err, user);
            }
        });
   }
));

// request for Twitter authentication
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter callback
app.get('localhost:3000/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to for client to continue auth process
    res.redirect('/account');
});



// client verifies auth flow are receives jwt token in response or redirects to login page otherwise
app.post('/verify', function(req, res){
  if (req.isAuthenticated()) {
     res.status(201).send({
      id_token: createToken(req.user.username),
      user: req.user.username
  });
  } else { res.redirect('/login') }
 });

// handle logout in passport
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
