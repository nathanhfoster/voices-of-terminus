import axios from 'axios'

export const Axios = (token) => {
  return axios.create({
    withCredentials: token ? true : false,
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    async: true,
    crossDomain: true,
    headers: token ? {
      'Authorization': "Token " + token,
      'Cache-Control': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Headers": '*',
    } : {
      'Cache-Control': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Headers": '*',
    }
})
}

export const AxiosForm = (token, payload) => axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
      'Authorization': "Token " + token,
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': `multipart/form-data; boundary=${payload._boundary}`,
    }
})