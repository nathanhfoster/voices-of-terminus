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

export const getUsers = () => {
    return async (dispatch) => await Axios.get('users')
       .then(res => {
         dispatch({
           type: C.GET_USERS,
           payload: res.data
         })
       }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const getUser = id => {
  return async (dispatch) => await Axios.get('users/' + id + '/')
     .then(res => {
       dispatch({
         type: C.GET_USER,
         payload: res.data
       })
     }).catch((e) => dispatch({
      type: C.SET_API_RESPONSE,
      payload: e.response
  }))
}