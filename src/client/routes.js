import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'
import About from './components/About'
import Nightlife from './containers/Nightlife'
import LoginPage from './containers/LoginPage'
import SignupPage from './containers/SignupPage'
import PassportAuth from './containers/PassportAuth'

export default (
  <Route name = 'home' component = {App}>
  	<Route path = '/' name = 'nightlife' component = {Nightlife} />
  	<Route path = 'about' name = 'about' component = {About} />
  	<Route path = 'login' name = 'login' component = {LoginPage} />
  	<Route path = 'signup' name = 'signup' component = {SignupPage} />
  	<Route path = 'account' name = 'account' component = {PassportAuth} />
  </Route>
);
