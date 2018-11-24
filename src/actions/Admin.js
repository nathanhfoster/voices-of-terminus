import C from '../constants'
import {Axios, AxiosForm} from './Axios'
import qs from 'qs'

export const getUsersWithProfileImages = () => {
  return async (dispatch) => await Axios().get('users/')
     .then(res => {
       dispatch({
         type: C.GET_USERS,
         payload: res.data
       })
     }).catch((e) => console.log(e))
}

export const getUsers = () => {
    return async (dispatch) => await Axios().get('users/all/')
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

export const createUser = payload => {
  return async (dispatch, getState) => await AxiosForm(null, payload).post('users/', payload)
  .then(res => {
    let {Users} = getState().Admin
    Users.push(res.data)
      dispatch({
          type: C.GET_USERS,
          payload: Users
        })
    }).catch((e) => console.log(e))
}


export const deleteUser = (token, id) => {
  return async (dispatch, getState) => await Axios(token).delete(`users/${id}/`)
     .then(res => {
      let {Users} = getState().Admin
      Users = Users.filter(user => user.id !== id)
       dispatch({
         type: C.GET_USERS,
         payload: Users
       })
     }).catch((e) => console.log(e))
}