import C from '../constants'
import {Axios} from './Axios'
import qs from 'qs'

export const getUsers = () => {
    return async (dispatch) => await Axios().get('users/')
       .then(res => {
         dispatch({
           type: C.GET_USERS,
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

export const updateUserProfile = (id, token, payload) => {
  return async (dispatch) => await Axios(token).patch(`users/${id}/`, qs.stringify(payload))
  .then(res => {
      dispatch({
        type: C.GET_USER,
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