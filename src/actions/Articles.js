import C from '../constants'
import {Axios} from './Axios'
const qs = require('qs')

export const postDocument = (token, payload) => {
  return async (dispatch) => { await Axios(token).post('articles/', qs.stringify(payload))
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

export const getArticles = () => {
  return async (dispatch) => await Axios().get("articles/")
     .then(res => {
       dispatch({
         type: C.GET_ARTICLES,
         payload: res.data
       })
     }).catch((e) => console.log(e))
}

export const getArticle = id => {
  return async (dispatch) => await Axios().get(`articles/${id}/`)
     .then(res => {
         dispatch ({
           type: C.GET_HTML_DOCUMENT,
           payload: res.data
       })
     }).catch((e) => console.log(e))
}

export const updateArticle = (id, token, payload) => {
  return async (dispatch) => await Axios(token).patch(`articles/${id}/`, qs.stringify(payload))
  .then(res => {
    dispatch ({
      type: C.GET_HTML_DOCUMENT,
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

export const deleteArticle = (id, token) => {
  return async (dispatch, getState) => await Axios(token).delete(`articles/${id}/`)
  .then(res => {
      const {Articles} = getState()
      dispatch ({
        type: C.GET_ARTICLES,
        payload: Articles.filter(article => article.id !== id)
      })
  }).catch((e) => console.log(e))
}