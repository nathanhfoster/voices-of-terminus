import C from '../constants'
import axios from 'axios'
const qs = require('qs')
const Axios = axios.create({
    //baseURL: 'http://localhost:8000/',
    baseURL: 'https://voices-of-terminus-db.herokuapp.com/',
    timeout: 5000,
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
    Axios.post('admin/api/v1/articles/',
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
  Axios.get('api/v1/articles/')
 .then(response => {
   console.log("GET: ", response.data)
 })
 .catch(error => {
   console.log(error)
 })
}