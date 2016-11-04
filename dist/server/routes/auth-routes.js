'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jwtConfig = require('../jwt-config');

var _jwtConfig2 = _interopRequireDefault(_jwtConfig);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _validateUser = require('../shared/validateUser');

var _validateUser2 = _interopRequireDefault(_validateUser);

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = process.env.MONGO_HOST;

var MongoClient = _mongodb2.default.MongoClient;

var app = module.exports = _express2.default.Router();

// create a jwt token for authenticated users
function createToken(username) {
  return _jsonwebtoken2.default.sign({ user: username }, _jwtConfig2.default, { expiresIn: 60 * 60 });
}

// handle new user registration
app.post('/register', function (req, res) {
  var userInfo = req.body;
  console.log('New registration received on server:', userInfo);
  var validation = (0, _validateUser2.default)(userInfo);
  // Check if the user submitted all the fields correctly
  if (validation.isValid) {
    _users2.default.findOne({
      id: userInfo.email
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        var passwordDigest = _bcrypt2.default.hashSync(userInfo.password, 10);
        user = new _users2.default({
          id: userInfo.email,
          displayName: userInfo.username,
          username: userInfo.username,
          password: passwordDigest,
          githubId: '',
          twitterId: '',
          userData: []
        });
        user.save(function (err) {
          if (err) console.log(err);
          res.status(201).send({
            username: userInfo.username,
            id_token: createToken(userInfo.username)
          });
        });
      } else if (user.password === '') {
        var _passwordDigest = _bcrypt2.default.hashSync(user.password, 10);
        user.password = _passwordDigest;
        user.save(function (err) {
          if (err) console.log(err);
          res.status(201).send({
            username: user.username,
            id_token: createToken(user.username)
          });
        });
      } else {
        console.log('user,', user);
        res.status(201).send({
          username: user.username,
          id_token: createToken(user.username)
        });
      }
    });
  } else {
    console.log('Invalid Registration:', validation.errors);
    res.status(400).send('Registration was in valid:', validation.errors);
  }
});

// handle user login
app.post('/sessions/create', function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;


  MongoClient.connect(url, function (err, db) {
    _assert2.default.equal(null, err);

    var Users = db.collection('users');

    Users.findOne({ id: email }).then(function (data) {
      // user does not exist in database
      if (data === null) {
        console.log('User does not exist');
        res.status(401).send('User does not exist');
        db.close();
      }
      // if user exists check if password is valid
      else if (_bcrypt2.default.compareSync(password, data.password)) {
          res.status(201).send({
            id_token: createToken(data.username),
            user: data.username
          });
          db.close();
        }
        // user exists but password was invalid
        else {
            res.status(401).send('Invalid login attempt');
            db.close();
          }
    });
  });
});