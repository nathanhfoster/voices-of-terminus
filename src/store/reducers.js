import C from '../constants.js'
import { combineReducers } from 'redux'

export const Window = (state = {}, action) =>
(action.type === C.SET_WINDOW) ? action.payload : state

export const guildMembers = (state = {}, action) =>
(action.type === C.SET_GUILD_MEMBERS) ? action.payload : state

export default combineReducers({
  Window,
  guildMembers
})
