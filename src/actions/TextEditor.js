import C from '../constants'
import axios from 'axios'
const qs = require('qs')
const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 20000,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
  }
})

export const setEditorState = (editorState) => ({
    type: C.SET_EDITOR_STATE,
    payload: editorState
 })

 export function postEditorState(payload){
   const {author, body, slug, tags, title} = payload
   Axios.post("admin/api/v1/articles/", qs.stringify({author, body, slug, tags, title }))
   .then(response => {
     console.log(response)
   })
   .catch(error => {
     console.log(error)
   })
 }

 export function getEditorState(){
   return (dispatch) => Axios.get("api/v1/articles/")
      .then(res=> {
          dispatch ({
            type: C.GET_ARTICLE_STATE,
            payload: res.data
        })
      })
}