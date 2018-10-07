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

export const createNewsletter = payload => {
    Axios.post('newsletters/', qs.stringify(payload))
    .then(res => {
        //console.log(res)
    }).catch(e => console.log(e))
}

export const getNewsletters = () => {
    return async (dispatch) => await Axios.get("newsletters/")
       .then(res => {
           //console.log(res)
           dispatch ({
             type: C.GET_NEWSLETTERS,
             payload: res.data
         })
       }).catch((e)=>console.log(e))
}

export const getNewsLetter = id => {
    return async (dispatch) => await Axios.get("newsletters/" + id + '/')
       .then(res => {
           //console.log(res)
           dispatch ({
             type: C.GET_HTML_DOCUMENT,
             payload: res.data
         })
       }).catch((e)=>console.log(e))
}

export const clearNewsLetter = () => ({
    type: C.DELETE_HTML_DOCUMENT,
    payload: null
})

export const updateNewsLetter = (id, payload) => {
    return  async (dispatch, getState) => await Axios.patch('newsletters/' + id + '/', qs.stringify(payload))
    .then(res => {
       let {Newsletters} = getState()
       payload = Newsletters.map(newsletter => {
            if (newsletter.id == id){
                console.log(newsletter)
                console.log(res.data)
                return newsletter = res.data
            }
            return newsletter
        })
        console.log("CHANGED PAYLOAD: ", payload)
        dispatch ({
            type: C.GET_NEWSLETTERS,
            payload: payload
    })
    }).catch((e)=>console.log(e))
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
    }).catch((e)=>console.log(e))
}