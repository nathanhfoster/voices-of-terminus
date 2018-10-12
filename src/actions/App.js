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
    baseURL: process.env.REACT_APP_API_URL + 'api/v1/',
    timeout: 2000,
    headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
  }
})

export function getVoTYouTubeChannelData() {
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

export function getAllVRYouTube() {
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

export function getVRYouTubeChannelData() {
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

 export const createUser = (username, password, email, bio, primary_role, primary_class) => {
    return async (dispatch) => await Axios.post('users/', qs.stringify({username, password, email, bio, primary_role, primary_class}))
    .then(res => {
        dispatch({
            type: C.SET_API_RESPONSE,
            payload: res
        })
        Axios.post('login/', qs.stringify({username, password}))
        .then(res => {
            Cookies.set('User_LoginToken', res.data.token, {expires: 365})
            Cookies.set('User_ID', res.data.id, {expires: 365})
            dispatch({
                type: C.SET_LOGIN_TOKEN,
                payload: res.data
             })
            //  dispatch({
            //     type: C.SET_API_RESPONSE,
            //     payload: res
            // })
        }).catch((e) => dispatch({
            type: C.SET_API_RESPONSE,
            payload: e.response
        }))
    })
    .catch((e) => console.log(e.response))
}

export const login = (username, password) => {
    return async (dispatch) => await Axios.post('login/', qs.stringify({username, password}))
    .then(res => {
        Cookies.set('User_LoginToken', res.data.token, {expires: 365})
        Cookies.set('User_ID', res.data.id, {expires: 365})
        dispatch({
            type: C.SET_LOGIN_TOKEN,
            payload: res.data
         })
         
         dispatch({
            type: C.SET_API_RESPONSE,
            payload: res
        })
    }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const updateProfile = (token, id, payload) => {
    const Authorized = axios.create({
        baseURL: process.env.REACT_APP_API_URL + 'api/v1/',
        timeout: 2000,
        headers: {
          'Authorization': "Token " + token,
          'Cache-Control': 'no-cache',
          'Content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
      }
    })
    return async (dispatch) => await Authorized.patch('users/' + id + '/', qs.stringify(payload))
    .then(res => {
        const {data} = res
        const dispatchPayload = {
            bio: data.bio,
            dateJoined: data.date_join,
            discordUrl: data.discord_url,
            email: data.email,
            firstName: data.first_name,
            id: data.id,
            isActive: data.is_active,
            isStaff: data.is_staff,
            isSuperUser: data.is_superuser,
            lastLogin: data.last_login,
            lastName: data.last_name,
            primaryClass: data.primary_class,
            primaryRole: data.primary_role,
            profession: data.profession,
            professionSpecialization: data.profession_specialization,
            profileImage: data.profile_image,
            secondaryClass: data.secondary_class,
            secondaryRole: data.secondary_role,
            token: token,
            twitchUrl: data.twitch_url,
            twitterUrl: data.twitter_url,
            username: data.username,
            youtubeUrl: data.youtube_url
        }
        dispatch({
            type: C.SET_LOGIN_TOKEN,
            payload: dispatchPayload
         })
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: res
        })
    }).catch((e) => dispatch({
      type: C.SET_API_RESPONSE,
      payload: e.response
      }))
  }

export const setApiResponse = response => {
    return async (dispatch) => await dispatch({
        type: C.SET_API_RESPONSE,
        payload: response
    })
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
    Cookies.remove('User_LoginToken') //when redirected to Articles from login the first get articles sends a 401
    Cookies.remove('User_ID')
    return async (dispatch) => await dispatch({
        type: C.SET_LOGOUT,
        payload: null
    })
}
