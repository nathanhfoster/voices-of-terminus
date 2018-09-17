import C from '../constants'
import axios from 'axios'
const qs = require('qs')
const Axios = axios.create({
    baseURL: 'https://voices-of-terminus-db.herokuapp.com/',
    timeout: 1000,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
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
     console.log(response);
   })
   .catch(error => {
     console.log(error);
   })
 }