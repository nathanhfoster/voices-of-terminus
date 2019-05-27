import C from "../../constants";
import YTube from "ytube";
import { shouldUpdate } from "./index";

const {
  REACT_APP_YOUTUBE_API_KEY,
  REACT_APP_VOT_YOUTUBE_CHANNEL_ID,
  REACT_APP_VR_YOUTUBE_CHANNEL_ID,
  REACT_APP_VOT_PLAYLIST_ID_SHOW
} = process.env;

const ytube = new YTube(REACT_APP_YOUTUBE_API_KEY);

const getVoTYouTubeChannelData = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VoTYouTubeChannelData;

  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .getChannelsLatestVideos(REACT_APP_VOT_YOUTUBE_CHANNEL_ID, 50)
      .then(res => {
        dispatch({
          type: C.GET_VOT_YOUTUBE_CHANNEL_DATA,
          payload: res
        });
      })
      .catch(e => console.log("getVoTYouTubeChannelData: ", e))
  );
};

const getVotChannelsPlayLists = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VotChannelsPlaylist;

  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .getChannelsPlayLists(REACT_APP_VOT_YOUTUBE_CHANNEL_ID, 50)
      .then(res => {
        dispatch({
          type: C.GET_VOT_CHANNELS_PLAYLISTS,
          payload: res
        });
      })
      .catch(e => console.log("getVotChannelsPlayLists: ", e))
  );
};

const getVotPlaylistShow = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VotPlaylistShow;

  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .getPlaylistVideos(REACT_APP_VOT_PLAYLIST_ID_SHOW, 50)
      .then(res => {
        dispatch({
          type: C.GET_VOT_PLAYLIST_SHOW,
          payload: res
        });
      })
      .catch(e => console.log("getVotPlaylistShow: ", e))
  );
};

const getAllVotYouTube = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VotAllYouTubeChannelData;
  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .fetchAllYouTube("Voices of Terminus")
      .then(res => {
        dispatch({
          type: C.GET_ALL_VOT_YOUTUBE_CHANNEL_DATA,
          payload: res
        });
      })
      .catch(e => console.log("getAllVotYouTube: ", e))
  );
};

const getVRYouTubeChannelData = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VRYouTubeChannelData;
  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .getChannelsLatestVideos(REACT_APP_VR_YOUTUBE_CHANNEL_ID, 50)
      .then(res => {
        dispatch({
          type: C.GET_VR_YOUTUBE_CHANNEL_DATA,
          payload: res
        });
      })
      .catch(e => console.log("getVRYouTubeChannelData: ", e))
  );
};

export {
  getVoTYouTubeChannelData,
  getVotChannelsPlayLists,
  getVotPlaylistShow,
  getAllVotYouTube,
  getVRYouTubeChannelData
};
