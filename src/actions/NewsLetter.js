import C from '../constants'
import axios from 'axios'
import Cookies from 'js-cookie'

const qs = require('qs')
const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL + 'api/v1/',
    timeout: 2000,
    headers: {
      'Authorization': "Token " + Cookies.get('User_LoginToken'),
      'Cache-Control': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
  }
})

export const postNewsletter = payload => {
    return async (dispatch) => { await  Axios.post('newsletters/', qs.stringify(payload))
      .then(res => {
        dispatch({
            type: C.SET_API_RESPONSE,
            payload: res
            })
      }).catch((e) => dispatch({
      type: C.SET_API_RESPONSE,
      payload: e.response
      }))
    }
}

export const getNewsletters = () => {
    return async (dispatch) => await Axios.get("newsletters/")
       .then(res => {
           dispatch ({
             type: C.GET_NEWSLETTERS,
             payload: res.data
            })
       }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const getNewsLetter = id => {
    return async (dispatch) => await Axios.get("newsletters/" + id + '/')
       .then(res => {
           //console.log(res)
           dispatch ({
             type: C.GET_HTML_DOCUMENT,
             payload: res.data
            })
       }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const updateNewsLetter = (id, payload) => {
    return  async (dispatch) => await Axios.patch('newsletters/' + id + '/', qs.stringify(payload))
    .then(res => {
        dispatch ({
            type: C.GET_HTML_DOCUMENT,
            payload: res.data
        })
    }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const deleteNewsLetter = id => {
    return async (dispatch, getState) => await Axios.delete('newsletters/' + id + '/')
    .then(res => {
        let {Newsletters} = getState()
        const payload = Newsletters.filter(newsletter => newsletter.id !== id)
        dispatch ({
            type: C.GET_NEWSLETTERS,
            payload: payload
        })
    }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}