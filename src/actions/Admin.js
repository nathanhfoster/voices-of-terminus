import C from '../constants'
import {Axios} from './Axios'
const qs = require('qs')

export const getUsers = () => {
    return async (dispatch) => await Axios.get('users/')
       .then(res => {
         dispatch({
           type: C.GET_USERS,
           payload: res.data
         })
       }).catch((e) => console.log(e))
}

export const getUser = id => {
  return async (dispatch) => await Axios.get(`users/${id}/`)
     .then(res => {
       dispatch({
         type: C.GET_USER,
         payload: res.data
       })
     }).catch((e) => console.log(e))
}

export const clearUser = () => {
  return async (dispatch) =>
       dispatch({
         type: C.GET_USER,
         payload: null
       })
}

export const updateUserProfile = (id, payload) => {
  return async (dispatch) => await Axios.patch(`users/${id}/`, qs.stringify(payload))
  .then(res => {
      dispatch({
        type: C.GET_USER,
        payload: res.data
      })
      // dispatch({
      //   type: C.SET_API_RESPONSE,
      //   payload: res
      // })
  }).catch((e) => console.log(e))
  // .catch((e) => dispatch({
  //   type: C.SET_API_RESPONSE,
  //   payload: e.response
  //   }))
}