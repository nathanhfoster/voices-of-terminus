import axios from "axios";
import qs from "qs";
const { REACT_APP_API_URL } = process.env;

export const Axios = (token, pagination) =>
  axios.create({
    withCredentials: token ? true : false,
    baseURL: pagination ? pagination : REACT_APP_API_URL,
    timeout: 25000,
    async: true,
    crossDomain: true,
    headers: token
      ? {
          Authorization: "Token " + token,
          "Cache-Control": "no-cache",
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        }
      : {
          "Cache-Control": "no-cache",
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        }
  });

export const AxiosForm = (token, payload) =>
  axios.create({
    baseURL: REACT_APP_API_URL,
    timeout: 25000,
    headers: token
      ? {
          Authorization: "Token " + token,
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${payload._boundary}`
        }
      : {
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${payload._boundary}`
        }
  });

export const AxiosData = (token, payload) => {
  return axios.create({
    withCredentials: token ? true : false,
    baseURL: REACT_APP_API_URL,
    timeout: 25000,
    async: true,
    crossDomain: true,
    headers: token
      ? {
          Authorization: "Token " + token,
          "Cache-Control": "no-cache",
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        }
      : {
          "Cache-Control": "no-cache",
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
    data: payload
  });
};
