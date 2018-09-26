import C from '../constants'
import axios from 'axios'
import Cookies from 'js-cookie'
const qs = require('qs')
const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 25000,
    headers: {
      'Authorization': "Token " + Cookies.get('LoginToken'),
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
  // xsrfCookieName: Cookies.get('csrftoken'),
  // xsrfHeaderName: "X-CSRFToken"
})

export const setEditorState = (editorState) => ({
    type: C.SET_EDITOR_STATE,
    payload: editorState
 })

 export function getEditorState(){
  return (dispatch) => Axios.get("api/v1/articles/")
     .then(res=> {
         dispatch ({
           type: C.GET_ARTICLE_STATE,
           payload: res.data
       })
     })
}

 export function postEditorState(payload){
   const {title, slug, author, body, tags, last_modified_by} = payload
   Axios.post('api/v1/articles/', qs.stringify({title, slug, author, body, tags, last_modified_by}))
   .then(response => {
     //console.log(response)
   }).catch((e)=>console.log(e))
 }

 export function deleteArticle(id){
   Axios.delete("api/v1/articles/", qs.stringify({id}))
   .then(response => {
    console.log(response)
  }).catch((e)=>console.log(e))
}