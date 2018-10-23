import C from '../constants'
import {Axios} from './Axios'
import Cookies from 'js-cookie'
const qs = require('qs')

 export const createUser = (username, password, email, bio, primary_role, primary_class) => {
    return async (dispatch) => await Axios.post('users/', qs.stringify({username, password, email, bio, primary_role, primary_class}))
    .then(res => {
        dispatch({
            type: C.SET_API_RESPONSE,
            payload: res
        })
        Axios.post('login/', qs.stringify({username, password}))
        .then(res => {
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
    .catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const updateProfile = (id, payload) => {
    return async (dispatch) => await Axios.patch('users/' + id + '/', qs.stringify(payload))
    .then(res => {
        let {data} = res
        data.token = Cookies.get('User_LoginToken')
        dispatch({
            type: C.SET_LOGIN_TOKEN,
            payload: data
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