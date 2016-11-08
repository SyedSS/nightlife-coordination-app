import axios from 'axios'
import { browserHistory } from 'react-router'

import { DEV_HOST, PROD_HOST } from '../constants/host'

const HOST = PROD_HOST;

// There are three possible states for our login process and we need actions for each of them
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user.id_token,
    userID: user.userID,
    user: user.user
  }
}

function loginError(error) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    error
  }
}

export function checkAuth() {
  return dispatch => {
    return axios.post(`${HOST}/verify`).then ( (res) => {
      if (res.status === 201) {

          const user = res.data;

          // Dispatch the success action
          dispatch(receiveLogin(user))

          browserHistory.push('/');
        }
      }).catch(err => { 
        console.log('You are not authenticated', err.response.data);
        dispatch(loginError(err.response.data));
        })
    }
  }


// Calls the API to get a token and dispatches actions along the way
export function loginUser(creds) {
 
  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return axios.post(`${HOST}/sessions/create`, creds).then ( (res) => {
      
      if (res.status === 201) {

          const user = res.data;

          // Dispatch the success action
          dispatch(receiveLogin(user))

          browserHistory.push('/');
        }
      }).catch(err => { 
        console.log('Authentication failed:', err.response.data);
        dispatch(loginError(err.response.data));
    })
  }
}

export const NEW_SIGNUP = 'NEW_SIGNUP'
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR'

export function newSignUp(user) {
  return {
    type: NEW_SIGNUP,
    isFetching: true,
    isAuthenticated: false
  }
}

export function registrationError(error) {
  return {
    type: REGISTRATION_ERROR,
    isFetching: false,
    isAuthenticated: false,
    error
  }
}

export function registerUser(user) {

  return dispatch => {

    // New signup action is dispatched
    dispatch(newSignUp(user))

    // Request is made to the server with the registration data
    return axios.post(`${HOST}/register`, user).then( (res) => {

      let user = {
        user: res.data.username,
        userID: res.data.userID,
        id_token: res.data.id_token
      }

      // Login success action is dispatched
      dispatch(receiveLogin(user));

    }).then( () => {
      // User is redirected to the home page
      browserHistory.push('/');
    }).catch( (err) => {
      console.log('Registration Error:', err.response.data);
      dispatch(registrationError(err.response.data));
    });

  }
}