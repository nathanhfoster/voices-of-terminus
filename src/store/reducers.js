import C from "../constants.js";
import { combineReducers } from "redux";

export const ApiResponse = (state = {}, action) =>
  action.type === C.SET_API_RESPONSE
    ? action.payload
    : action.type === C.CLEAR_API_RESPONSE
    ? {}
    : state;

export const VoTYouTubeChannelData = (state = [], action) =>
  action.type === C.GET_VOT_YOUTUBE_CHANNEL_DATA ? action.payload : state;

export const VotAllYouTubeChannelData = (state = [], action) =>
  action.type === C.GET_ALL_VOT_YOUTUBE_CHANNEL_DATA ? action.payload : state;

export const VotChannelsPlaylist = (state = [], action) =>
  action.type === C.GET_VOT_CHANNELS_PLAYLISTS ? action.payload : state;

export const VotPlaylistShow = (state = [], action) =>
  action.type === C.GET_VOT_PLAYLIST_SHOW ? action.payload : state;

export const VotTwitchStreams = (state = [], action) =>
  action.type === C.GET_VOT_TWITCH_STREAMS ? action.payload : state;

export const VRYouTubeChannelData = (state = [], action) =>
  action.type === C.GET_VR_YOUTUBE_CHANNEL_DATA ? action.payload : state;

export const Window = (state = {}, action) =>
  action.type === C.SET_WINDOW ? action.payload : state;

export const DiscordData = (state = {}, action) =>
  action.type === C.GET_GUILD_MEMBERS ? action.payload : state;

export const editorState = (state = null, action) =>
  action.type === C.SET_EDITOR_STATE ? action.payload : state;

export const Articles = (state = { results: [] }, action) =>
  action.type === C.GET_ARTICLES ? action.payload : state;

export const Newsletters = (state = { results: [] }, action) =>
  action.type === C.GET_NEWSLETTERS ? action.payload : state;

export const HtmlDocument = (state = null, action) =>
  action.type === C.GET_HTML_DOCUMENT
    ? action.payload
    : action.type === C.CLEAR_HTML_DOCUMENT
    ? null
    : state;

export const User = (state = {}, action) =>
  action.type === C.SET_LOGIN_TOKEN
    ? action.payload
    : action.type === C.SET_LOGOUT
    ? {}
    : state;

export const Messages = (state = { results: [] }, action) =>
  action.type === C.GET_MESSAGES
    ? action.payload
    : action.type === C.SET_LOGOUT
    ? {}
    : state;

export const Admin = (state = {}, action) => {
  switch (action.type) {
    case C.GET_USERS:
      return { ...state, Users: action.payload };
    case C.GET_USER:
      return { ...state, User: action.payload };
    case C.SET_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const Settings = (state = { showFooter: true, pushMessages: false }, action) => {
  switch (action.type) {
    case C.SHOW_FOOTER:
      return { ...state, showFooter: action.payload };
    case C.PUSH_MESSAGES:
      return { ...state, pushMessages: action.payload };
    default:
      return state;
  }
};

export const Galleries = (state = { results: [] }, action) => {
  switch (action.type) {
    case C.GET_GALLERIES:
      return action.payload;
    case C.GET_GALLERY:
      return { ...state, Gallery: action.payload };
    default:
      return state;
  }
};

export const appReducer = combineReducers({
  ApiResponse,
  VoTYouTubeChannelData,
  VotAllYouTubeChannelData,
  VotChannelsPlaylist,
  VotPlaylistShow,
  VotTwitchStreams,
  VRYouTubeChannelData,
  Window,
  DiscordData,
  editorState,
  Articles,
  Newsletters,
  HtmlDocument,
  User,
  Admin,
  Settings,
  Galleries,
  Messages
});
