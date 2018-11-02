import C from '../constants'
import {Axios} from './Axios'
import Cookies from 'js-cookie'
import YTube from 'ytube'
const youTubeKey = process.env.REACT_APP_YOUTUBE_API_KEY
const ytube = new YTube(youTubeKey)
const votYouTubeChanneID = process.env.REACT_APP_VOT_YOUTUBE_CHANNEL_ID
const vrYouTubeChanneID = process.env.REACT_APP_VR_YOUTUBE_CHANNEL_ID
const qs = require('qs')

export const getVoTYouTubeChannelData = () => {
    return async (dispatch) => await ytube.getChannelsLatestVideos(votYouTubeChanneID, 50)
        .then(res => {
            dispatch ({
                type: C.GET_VOT_YOUTUBE_CHANNEL_DATA,
                payload: res.latest
            })
        }).catch((e) => dispatch({
            type: C.SET_API_RESPONSE,
            payload: e.response
        }))
}

export const getAllVRYouTube = () => {
    return async (dispatch) => await ytube.fetchAllYouTube("Voices of Terminus")
        .then(res => {
            dispatch({
                type: C.GET_ALL_VR_YOUTUBE_CHANNEL_DATA,
                payload:res
            })
        }).catch((e) => dispatch({
            type: C.SET_API_RESPONSE,
            payload: e.response
        }))
}

export const getVRYouTubeChannelData = () => {
    return async (dispatch) => await ytube.getChannelsLatestVideos(vrYouTubeChanneID, 50)
        .then(res => {
            dispatch ({
                type: C.GET_VR_YOUTUBE_CHANNEL_DATA,
                payload: res.latest
            })
        }).catch((e) => dispatch({
            type: C.SET_API_RESPONSE,
            payload: e.response
        }))
}

export const setWindow = Window => ({
    type: C.SET_WINDOW,
    payload: Window
 })

export const login = (username, password, rememberMe) => {
    return async (dispatch) => await Axios.post('login/', qs.stringify({username, password}))
    .then(res => {
        const eightHours = 1/3
        rememberMe ? Cookies.set('User_LoginToken', res.data.token) : Cookies.set('User_LoginToken', res.data.token, {expires: eightHours})
        dispatch({
            type: C.SET_LOGIN_TOKEN,
            payload: res.data
         })
         dispatch({
            type: C.SET_API_RESPONSE,
            payload: res
        })
        window.location.reload()
    }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const setApiResponse = response => {
    return async (dispatch) => {
        await dispatch({
            type: C.SET_API_RESPONSE,
            payload: response
        })
    }
}

export const clearApiResponse = () => {
    return async (dispatch) => await dispatch({
        type: C.SET_API_RESPONSE,
        payload: null
    })
}

export const clearHtmlDocument = () => ({
    type: C.CLEAR_HTML_DOCUMENT,
    payload: null
})

export const Logout = () => {
    Cookies.remove('User_LoginToken')
    return async (dispatch) => {
        await dispatch({
        type: C.SET_LOGOUT,
        payload: null
    })
    window.location.reload()
    }
}

export const getUser = id => {
    return async (dispatch) => await Axios.get(`users/${id}/`)
       .then(res => {
        res.data.token = Cookies.get('User_LoginToken')
         dispatch({
           type: C.SET_LOGIN_TOKEN,
           payload: res.data
         })
       }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
  }