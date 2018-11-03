import axios from 'axios'
import Cookies from 'js-cookie'
const token = Cookies.get('User_LoginToken')
const headers = token ? {
  'Authorization': "Token " + token,
  'Cache-Control': 'no-cache',
  'Content-type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json'
} : {
  'Cache-Control': 'no-cache',
  'Content-type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json'
}

export const Axios = axios.create({
    withCredentials: token ? true : false,
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers
})