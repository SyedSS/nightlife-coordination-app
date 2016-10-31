import express from 'express'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import jwt from 'jsonwebtoken'
import secret from '../jwt-config'

import User from '../models/users'

const app = module.exports = express.Router();

function createToken(username) {
  return jwt.sign({user: username}, secret, { expiresIn: 60 * 60 });
}

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
        // check user table for anyone with a facebook ID of profile.id
        User.findOne({
            githubId: profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    githubId: profile.displayName,
                    displayName: profile.username,
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
      }
    ));


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect
    console.log(req.user);
		res.redirect('/account');
});

app.post('/verify', function(req, res){
	console.log('verify:', req.user)
	if (req.isAuthenticated()) {
	   res.status(201).send({
      id_token: createToken(req.user.username),
      user: req.user.username
  });
	} else{
	 res.redirect('/login');
	}
 });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
