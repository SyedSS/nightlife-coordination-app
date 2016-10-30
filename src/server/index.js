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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (NODE_ENV === 'development') {
  devConfig(app);
} else {
  prodConfig(app);
}

// test connection to database
mongoose.Promise = global.Promise
mongoose.connect(url, () => { console.log('connected through mongoose') });

app.use(express.static('dist/client'));

app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); 

// connect authentication routes
app.use(authRoutes);
app.use(passportRoutes);

app.use(fallback(path.join(__dirname, '../../dist/client/index.html')));

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`The Express Server is Listening at port ${PORT} in ${NODE_ENV} mode`);
});

export default app;
