import { combineReducers } from 'redux'

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, NEW_SIGNUP, REGISTRATION_ERROR } from '../actions/login'
import { LOGOUT_SUCCESS } from '../actions/logout'

const defaultState = {
  loginError: '',
  registrationError: '',
  isFetching: false,
  user: '',
  userID: '',
  id_token: '',
  isAuthenticated: false
}

const auth = (state = defaultState, action) => {

  switch (action.type) {
  
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.user
      });
  
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        loginError: '',
        registrationError: '',
        user: action.user,
        userID: action.userID,
        id_token: action.id_token
      });
  
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        loginError: action.error
      });
   
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: '',
        userID: '',
        id_token: ''
      });
  
    case NEW_SIGNUP:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      });

    case REGISTRATION_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        registrationError: action.error
      });
 
    default:
      return state;

  }
}

export default auth;