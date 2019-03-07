import C from "../constants";
import { Axios } from "./Axios";
import Cookies from "js-cookie";
import YTube from "ytube";
import qs from "qs";
const {
  REACT_APP_YOUTUBE_API_KEY,
  REACT_APP_VOT_YOUTUBE_CHANNEL_ID,
  REACT_APP_VR_YOUTUBE_CHANNEL_ID,
  REACT_APP_VOT_PLAYLIST_ID_SHOW
} = process.env;
const ytube = new YTube(REACT_APP_YOUTUBE_API_KEY);

export const getVoTYouTubeChannelData = () => dispatch =>
  ytube
    .getChannelsLatestVideos(REACT_APP_VOT_YOUTUBE_CHANNEL_ID, 50)
    .then(res => {
      dispatch({
        type: C.GET_VOT_YOUTUBE_CHANNEL_DATA,
        payload: res.latest
      });
    })
    .catch(e => console.log("getVoTYouTubeChannelData: ", e));

export const getVotChannelsPlayLists = () => dispatch =>
  ytube
    .getChannelsPlayLists(REACT_APP_VOT_YOUTUBE_CHANNEL_ID, 50)
    .then(res => {
      dispatch({
        type: C.GET_VOT_CHANNELS_PLAYLISTS,
        payload: res
      });
    })
    .catch(e => console.log("getVotChannelsPlayLists: ", e));

export const getVotPlaylistShow = () => dispatch =>
  ytube
    .getPlaylistVideos(REACT_APP_VOT_PLAYLIST_ID_SHOW, 50)
    .then(res => {
      dispatch({
        type: C.GET_VOT_PLAYLIST_SHOW,
        payload: res
      });
    })
    .catch(e => console.log("getVotPlaylistShow: ", e));

export const getVotTwitchStreams = () => dispatch =>
  Axios()
    .get(
      "https://api.twitch.tv/kraken/channels/pantheon_vot/videos?broadcasts=true&limit=20&client_id=jvqb2pnewihctq9ov3on4ajzhyqc7t"
    )
    .then(res => {
      dispatch({
        type: C.GET_VOT_TWITCH_STREAMS,
        payload: res.data
      });
    })
    .catch(e => console.log("getVotTwitchStreams: ", e));

export const getAllVotYouTube = () => dispatch =>
  ytube
    .fetchAllYouTube("Voices of Terminus")
    .then(res => {
      dispatch({
        type: C.GET_ALL_VOT_YOUTUBE_CHANNEL_DATA,
        payload: res
      });
    })
    .catch(e => console.log("getAllVotYouTube: ", e));

export const getVRYouTubeChannelData = () => dispatch =>
  ytube
    .getChannelsLatestVideos(REACT_APP_VR_YOUTUBE_CHANNEL_ID, 50)
    .then(res => {
      dispatch({
        type: C.GET_VR_YOUTUBE_CHANNEL_DATA,
        payload: res.latest
      });
    })
    .catch(e => console.log("getVRYouTubeChannelData: ", e));

export const setWindow = Window => ({
  type: C.SET_WINDOW,
  payload: Window
});

export const login = (username, password, rememberMe) => dispatch =>
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

export const Logout = () => dispatch => {
  Cookies.remove("User_LoginToken");
  return dispatch({
    type: C.SET_LOGOUT,
    payload: null
  });
};

export const setApiResponse = response => ({
  type: C.SET_API_RESPONSE,
  payload: response
});

export const clearApiResponse = () => ({
  type: C.SET_API_RESPONSE,
  payload: null
});

export const setUser = User => ({
  type: C.GET_USER,
  payload: User
});

export const getUser = id => dispatch =>
  Axios()
    .get(`users/${id}/`)
    .then(res => getUserCharacters(res.data, dispatch))
    .catch(e => console.log(e));

const getUserCharacters = (User, dispatch) =>
  Axios()
    .get(`user/characters/${User.id}/view/`)
    .then(res => {
      User.Characters = res.data;
      dispatch({
        type: C.GET_USER,
        payload: User
      });
    })
    .catch(e => console.log(e));

export const refreshPatchUser = (token, id) => dispatch =>
  Axios(token)
    .get(`users/${id}/refresh/`)
    .then(res => {
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

export const setHtmlDocument = Document => ({
  type: C.GET_HTML_DOCUMENT,
  payload: Document
});

export const clearHtmlDocument = () => ({
  type: C.CLEAR_HTML_DOCUMENT,
  payload: null
});
