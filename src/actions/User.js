import C from '../constants'
import axios from 'axios'
import {Axios, AxiosForm} from './Axios'
import Cookies from 'js-cookie'
import qs from 'qs'

 export const createUser = payload => {
    const eightHours = 1/3
    return async (dispatch) => await AxiosForm(null, payload).post('users/', payload)
    .then(res => {
        AxiosForm(null, payload).post('login/', payload)
        .then(res => {
            Cookies.set('User_LoginToken', res.data.token, {expires: eightHours})
            dispatch({
                type: C.SET_LOGIN_TOKEN,
                payload: res.data
             })
        }).catch((e) => console.log(e))
    }).catch((e) => console.log(e))
}

export const updateProfile = (id, token, payload) => {
    return async (dispatch) => await AxiosForm(token, payload).patch(`users/${id}/`, payload)
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