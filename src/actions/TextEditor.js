import C from '../constants'
import axios from 'axios'
const qs = require('qs')
const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 30000,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
  }
})

export const setEditorState = (editorState) => ({
    type: C.SET_EDITOR_STATE,
    payload: editorState
 })

 export function postEditorState(title){
    Axios.post("admin/api/v1/articles/",
     qs.stringify({ 'title': title })
   )
   .then(response => {
     console.log(response)
   })
   .catch(error => {
     console.log(error)
   })
 }

 export function getEditorState(){
   console.log("API_URL typeof: ", typeof process.env.REACT_APP_API_URL)
   console.log("API_URL: ", process.env.REACT_APP_API_URL)
   console.log("process.env: ", process.env)
  Axios.get("api/v1/articles/")
 .then(response => {
   console.log("GET: ", response.data)
 })
 .catch(error => {
   console.log(error)
 })
}