import C from '../constants.js'
import { combineReducers } from 'redux'

export const guildMembers = (state = {}, action) =>
(action.type === C.SET_GUILD_MEMBERS) ? action.payload : state

export default combineReducers({
  guildMembers
})
