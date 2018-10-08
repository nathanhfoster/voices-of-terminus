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

export const createDocument = payload => 
  Axios.post('articles/', qs.stringify(payload))
  .then(res => {
    //console.log(res)
  }).catch((e)=>console.log(e))


export const getArticles = () => {
  return async (dispatch) => await Axios.get("articles/")
     .then(res => {
         dispatch ({
           type: C.GET_ARTICLES,
           payload: res.data
       })
     }).catch((e)=>console.log(e))
}

export const getArticle = id => {
  console.log(id)
  return async (dispatch) => await Axios.get('articles/' + id + '/')
     .then(res => {
         dispatch ({
           type: C.GET_HTML_DOCUMENT,
           payload: res.data
       })
     }).catch((e)=>console.log(e))
}

export const updateArticle = (id, payload) => {
  return  async (dispatch, getState) => await Axios.patch('articles/' + id + '/', qs.stringify(payload))
  .then(res => {
    let {HtmlDocument} = getState()
    HtmlDocument = res.data
    console.log(res.data)
      dispatch ({
          type: C.GET_HTML_DOCUMENT,
          payload: HtmlDocument
      })
  }).catch((e)=>console.log(e))
}

export const deleteArticle = id => {
  return async (dispatch, getState) => await Axios.delete('articles/' + id + '/')
  .then(res => {
      let {Articles} = getState()
      const payload = Articles.filter(article => article.id !== id)
      dispatch ({
        type: C.GET_ARTICLES,
        payload: payload
  })
  }).catch((e)=>console.log(e))
}