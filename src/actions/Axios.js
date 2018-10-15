import axios from 'axios'
import Cookies from 'js-cookie'
const token = Cookies.get('User_LoginToken')
const headers = token ? {
  'Authorization': "Token " + token,
  'Content-type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json'
} : {
  'Cache-Control': 'no-cache',
  'Content-type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json'
}

//export const setAuthorizationToken = token => token ? axios.defaults.headers.common['authorization'] = `Token ` + token : delete axios.defaults.headers.common['authorization']

export const Axios = axios.create({
    withCredentials: token ? true : false,
    baseURL: process.env.REACT_APP_API_URL + 'api/v1/',
    timeout: 2000,
    headers
})