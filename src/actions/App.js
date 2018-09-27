import C from '../constants'
import axios from 'axios'
import Cookies from 'js-cookie'
import YTube from 'ytube'
const youTubeKey = process.env.REACT_APP_YOUTUBE_API_KEY
const ytube = new YTube(youTubeKey)
const votYouTubeChanneID = process.env.REACT_APP_VOT_YOUTUBE_CHANNEL_ID
const vrYouTubeChanneID = process.env.REACT_APP_VR_YOUTUBE_CHANNEL_ID
const qs = require('qs')
const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 25000,
    headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
  }
})

export function getVoTYouTubeChannelData() {
    return (dispatch) => ytube.getChannelsLatestVideos(votYouTubeChanneID, 50)
        .then(res => {
            dispatch ({
                type: C.GET_VOT_YOUTUBE_CHANNEL_DATA,
                payload: res.latest
            })
        }).catch((e)=>console.log(e))
}

export function getAllVRYouTube() {
    return (dispatch) => ytube.fetchAllYouTube("Voices of Terminus")
        .then(res => {
            dispatch({
                type: C.GET_ALL_VR_YOUTUBE_CHANNEL_DATA,
                payload:res
            })
        }).catch((e)=>console.log(e))
}

export function getVRYouTubeChannelData() {
    return (dispatch) => ytube.getChannelsLatestVideos(vrYouTubeChanneID, 50)
        .then(res => {
            dispatch ({
                type: C.GET_VR_YOUTUBE_CHANNEL_DATA,
                payload: res.latest
            })
        }).catch((e)=>console.log(e))
}

export const setWindow = (Window) => ({
    type: C.SET_WINDOW,
    payload: Window
 })

 export function setLoginToken(username, password) {
    return (dispatch) => Axios.post('api/v1/login/', qs.stringify({username, password}))
    .then(res => {
        Cookies.set('LoginToken', res.data.token, {expires: 365})
        dispatch({
            type: C.SET_LOGIN_TOKEN,
            payload: res.data.token
         })
    }).catch((e)=>console.log(e))
}

export const Logout = () => ({
    type: C.SET_LOGOUT,
    payload: null
})