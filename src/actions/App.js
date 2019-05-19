import C from "../constants";
import { Axios } from "./Axios";
import Cookies from "js-cookie";
import YTube from "ytube";
import qs from "qs";
import { GetUserPermissions } from "../helpers";
const {
  REACT_APP_YOUTUBE_API_KEY,
  REACT_APP_TWITCH_CLIENT_ID,
  REACT_APP_VOT_YOUTUBE_CHANNEL_ID,
  REACT_APP_VR_YOUTUBE_CHANNEL_ID,
  REACT_APP_VOT_PLAYLIST_ID_SHOW
} = process.env;
const ytube = new YTube(REACT_APP_YOUTUBE_API_KEY);

const getVoTYouTubeChannelData = () => dispatch =>
  ytube
    .getChannelsLatestVideos(REACT_APP_VOT_YOUTUBE_CHANNEL_ID, 50)
    .then(res => {
      dispatch({
        type: C.GET_VOT_YOUTUBE_CHANNEL_DATA,
        payload: res.latest
      });
    })
    .catch(e => console.log("getVoTYouTubeChannelData: ", e));

const getVotChannelsPlayLists = () => dispatch =>
  ytube
    .getChannelsPlayLists(REACT_APP_VOT_YOUTUBE_CHANNEL_ID, 50)
    .then(res => {
      dispatch({
        type: C.GET_VOT_CHANNELS_PLAYLISTS,
        payload: res
      });
    })
    .catch(e => console.log("getVotChannelsPlayLists: ", e));

const getVotPlaylistShow = () => dispatch =>
  ytube
    .getPlaylistVideos(REACT_APP_VOT_PLAYLIST_ID_SHOW, 50)
    .then(res => {
      dispatch({
        type: C.GET_VOT_PLAYLIST_SHOW,
        payload: res
      });
    })
    .catch(e => console.log("getVotPlaylistShow: ", e));

const getVotTwitchStreams = () => dispatch =>
  fetch(
    `https://api.twitch.tv/kraken/channels/pantheon_vot/videos?broadcasts=true&limit=20&client_id=${REACT_APP_TWITCH_CLIENT_ID}`
  )
    .then(response => response.json())
    .then(res =>
      dispatch({
        type: C.GET_VOT_TWITCH_STREAMS,
        payload: res
      })
    );

const getAllVotYouTube = () => dispatch =>
  ytube
    .fetchAllYouTube("Voices of Terminus")
    .then(res => {
      dispatch({
        type: C.GET_ALL_VOT_YOUTUBE_CHANNEL_DATA,
        payload: res
      });
    })
    .catch(e => console.log("getAllVotYouTube: ", e));

const getVRYouTubeChannelData = () => dispatch =>
  ytube
    .getChannelsLatestVideos(REACT_APP_VR_YOUTUBE_CHANNEL_ID, 50)
    .then(res => {
      dispatch({
        type: C.GET_VR_YOUTUBE_CHANNEL_DATA,
        payload: res.latest
      });
    })
    .catch(e => console.log("getVRYouTubeChannelData: ", e));

const setWindow = Window => ({
  type: C.SET_WINDOW,
  payload: Window
});

const login = (username, password, rememberMe) => dispatch =>
  Axios()
    .post("login/", qs.stringify({ username, password }))
    .then(res => {
      const eightHours = 1 / 3;
      rememberMe
        ? Cookies.set("User_LoginToken", res.data.token)
        : Cookies.set("User_LoginToken", res.data.token, {
            expires: eightHours
          });
      dispatch({
        type: C.SET_LOGIN_TOKEN,
        payload: res.data
      });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );

const Logout = () => dispatch => {
  Cookies.remove("User_LoginToken");
  return dispatch({
    type: C.SET_LOGOUT,
    payload: null
  });
};

const setApiResponse = response => ({
  type: C.SET_API_RESPONSE,
  payload: response
});

const clearApiResponse = () => ({
  type: C.SET_API_RESPONSE,
  payload: null
});

const setUser = User => ({
  type: C.GET_USER,
  payload: User
});

const getUser = id => dispatch =>
  Axios()
    .get(`users/${id}/`)
    .then(res => getUserCharactersAndPermissions(res.data, dispatch))
    .catch(e => console.log(e));

const getUserCharactersAndPermissions = (User, dispatch) =>
  Axios()
    .get(`user/characters/${User.id}/view/`)
    .then(res => {
      User.Characters = res.data;
      User.permissions = GetUserPermissions(User.user_permissions);
      dispatch({
        type: C.GET_USER,
        payload: User
      });
    })
    .catch(e => console.log(e));

const refreshPatchUser = (token, id) => dispatch =>
  Axios(token)
    .get(`users/${id}/refresh/`)
    .then(res => {
      res.data.permissions = GetUserPermissions(res.data.user_permissions);
      dispatch({
        type: C.SET_LOGIN_TOKEN,
        payload: res.data
      });
    })
    .catch(e =>
      e.response && e.response.status == 401
        ? dispatch({
            type: C.SET_LOGOUT,
            payload: null
          })
        : console.log(e)
    );

const setHtmlDocument = Document => ({
  type: C.GET_HTML_DOCUMENT,
  payload: Document
});

const clearHtmlDocument = () => ({
  type: C.CLEAR_HTML_DOCUMENT,
  payload: null
});

export {
  getVoTYouTubeChannelData,
  getVotChannelsPlayLists,
  getVotPlaylistShow,
  getVotTwitchStreams,
  getAllVotYouTube,
  getVRYouTubeChannelData,
  setWindow,
  login,
  Logout,
  setApiResponse,
  clearApiResponse,
  setUser,
  getUser,
  getUserCharactersAndPermissions,
  refreshPatchUser,
  setHtmlDocument,
  clearHtmlDocument
};
