import express from 'express'
import assert from 'assert'
import path from 'path'
import fallback from 'express-history-api-fallback'
import devConfig from './config/setup/dev'
import prodConfig from './config/setup/prod'
import { NODE_ENV, PORT } from './config/env'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'

dotenv.config();
// update in .env file for new projects
const url = process.env.MONGO_HOST;

import mongoose from 'mongoose'
import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient;

import authRoutes from './routes/auth-routes'
import apiRoutes from './routes/api-routes'
import passportRoutes from './routes/passport'

const app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (NODE_ENV === 'development') { devConfig(app) } else { prodConfig(app) }

// test connection to database
mongoose.Promise = global.Promise
mongoose.connect(url, () => { console.log('connected through mongoose') });

app.use(express.static('dist/client'));

app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user)
});
passport.deserializeUser(function(user, done) {
	done(null, user)
});

// connect authentication routes
app.use(authRoutes);
app.use(passportRoutes);

app.use(fallback(path.join(__dirname, '../../dist/client/index.html')));

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`The Express Server is Listening at port ${PORT} in ${NODE_ENV} mode`);
});

export default app;
