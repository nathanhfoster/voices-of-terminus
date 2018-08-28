import C from '../constants.js'
import { combineReducers } from 'redux'

export const userLocation = (state = {}, action) =>
(action.type === C.SET_USER_LOCATION) ? action.payload : state

export default combineReducers({
  userLocation
})
