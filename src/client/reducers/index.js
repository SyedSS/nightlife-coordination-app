import { combineReducers } from 'redux'
import auth from './auth-reducer'
import yelp from './yelp-reducer'

export default combineReducers({
  auth,
  yelp
});
