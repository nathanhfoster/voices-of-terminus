import C from "../constants.js";
import { combineReducers } from "redux";

export const ApiResponse = (state = {}, action) =>
  action.type === C.SET_API_RESPONSE
    ? action
      ? action.payload
      : {}
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

export const Articles = (state = { results: [] }, action) => {
  switch (action.type) {
    case C.GET_ARTICLES_LOADING:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case C.GET_ARTICLES:
      return {
        ...action.payload,
        loading: false,
        loaded: true,
        error: null
      };

    case C.GET_ARTICLES_ERROR:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.payload
      };
    default:
      return state;
  }
};

export const Newsletters = (state = { results: [] }, action) => {
  switch (action.type) {
    case C.GET_NEWSLETTERS_LOADING:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case C.GET_NEWSLETTERS:
      return {
        ...action.payload,
        loading: false,
        loaded: true,
        error: null
      };

    case C.GET_NEWSLETTERS_ERROR:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.payload
      };
    default:
      return state;
  }
};

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

export const Messages = (
  state = {
    count: null,
    next: null,
    previous: null,
    results: [],
    messageRecipients: [],
    messageDetails: { count: null, next: null, previous: null, results: [] }
  },
  action
) => {
  switch (action.type) {
    case C.GET_MESSAGES:
      return {
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
        results: action.payload.results,
        messageRecipients: state.messageRecipients,
        messageDetails: state.messageDetails
      };
    case C.GET_MESSAGE_DETAILS:
      return { ...state, messageDetails: action.payload };
    case C.GET_MESSAGE_RECIPIENTS:
      return { ...state, messageRecipients: action.payload };
    case C.SET_LOGOUT:
      return {
        count: null,
        next: null,
        previous: null,
        results: [],
        messageRecipients: [],
        messageDetails: { count: null, next: null, previous: null, results: [] }
      };
    default:
      return state;
  }
};

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

export const Settings = (
  state = { showFooter: true, pushMessages: true },
  action
) => {
  switch (action.type) {
    case C.SHOW_FOOTER:
      return { ...state, showFooter: action.payload };
    case C.PUSH_MESSAGES:
      return { ...state, pushMessages: action.payload };
    default:
      return state;
  }
};

export const Galleries = (state = { results: [], Gallery: {} }, action) => {
  switch (action.type) {
    case C.GET_GALLERIES_LOADING:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case C.GET_GALLERIES:
      return {
        ...action.payload,
        loading: false,
        loaded: true,
        error: null,
        Gallery: { results: [] }
      };

    case C.GET_GALLERY_LOADING:
      return {
        ...state,
        loading: false,
        loaded: true
      };

    case C.GET_GALLERY:
      return {
        ...state,
        Gallery: {
          ...action.payload,
          loading: false,
          loaded: true,
          error: null
        }
      };

    case C.GET_GALLERY_ERROR:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.payload
      };
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
