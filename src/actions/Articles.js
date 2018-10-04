import axios from 'axios'
import Cookies from 'js-cookie'

const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 25000,
    headers: {
      'Authorization': "Token " + Cookies.get('User_LoginToken'),
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
  }
})

export const deleteArticle = id => {
      Axios.delete('api/v1/articles/' + id)
      .then(response => {
      this.props.getEditorState()
    })
    .catch(error => {
      console.log(error)
    })
  }