import C from '../constants.js'
import { combineReducers } from 'redux'

export const VoTYouTubeChannelData = (state = {}, action) =>
(action.type === C.SET_VOT_YOUTUBE_CHANNEL_DATA) ? action.payload : state

export const VRAllYouTubeChannelData = (state = {}, action) =>
(action.type === C.SET_ALL_VR_YOUTUBE_CHANNEL_DATA) ? action.payload : state

export const VRYouTubeChannelData = (state = {}, action) =>
(action.type === C.SET_VR_YOUTUBE_CHANNEL_DATA) ? action.payload : state

export const VideoToWatch = (state = {}, action) =>
(action.type === C.SET_VIDEO_TO_WATCH) ? action.payload : state

export const Window = (state = {}, action) =>
(action.type === C.SET_WINDOW) ? action.payload : state

export const DiscordData = (state = {}, action) =>
(action.type === C.SET_GUILD_MEMBERS) ? action.payload : state

export default combineReducers({
  VoTYouTubeChannelData,
  VRAllYouTubeChannelData,
  VRYouTubeChannelData,
  VideoToWatch,
  Window,
  DiscordData
})
