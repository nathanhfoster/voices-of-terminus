import C from '../constants'
import axios from 'axios'
import Cookies from 'js-cookie'

const qs = require('qs')
const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL + 'api/v1/',
    timeout: 25000,
    headers: {
      'Authorization': "Token " + Cookies.get('User_LoginToken'),
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
  }
})

export const createNewsletter = payload => {
    Axios.post('newsletters/', qs.stringify(payload))
    .then(res => {
        //console.log(res)
    }).catch(e => console.log(e))
}

export const getNewsletters = () =>{
    return async (dispatch) => await Axios.get("newsletters/")
       .then(res => {
           //console.log(res)
           dispatch ({
             type: C.GET_NEWSLETTERS,
             payload: res.data
         })
       }).catch((e)=>console.log(e))
  }

export const deleteNewsLetter = id => {
    return async (dispatch, getState) => await Axios.delete('newsletters/' + id)
    .then(res => {
        let {Newsletters} = getState()
        const payload = Newsletters.filter(newsletter => newsletter.id !== id)
        dispatch ({
            type: C.GET_NEWSLETTERS,
            payload: payload
    })
    }).catch((e)=>console.log(e))
}