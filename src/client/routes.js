import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'
import About from './components/About'
import LoginPage from './containers/LoginPage'
import SignupPage from './containers/SignupPage'

import { store } from './index'

import { checkLogin } from './actions/login'

const checkAuth = (nextState, replace) => {
  store.dispatch(checkLogin());
  // const {login} = store.getState();
  // if (!login.isAuthenticated)
  //   replace('/login');
};


export default (
  <Route name = 'home' component = {App}>
  	<Route path = '/' name = 'about' component = {About} onEnter = {checkAuth} />
  	<Route path = 'login' name = 'login' component = {LoginPage} />
  	<Route path = 'signup' name = 'signup' component = {SignupPage} />
  </Route>
);
