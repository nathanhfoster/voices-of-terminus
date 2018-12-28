import axios from "axios";

export const Axios = (token, pagination) => {
  return axios.create({
    withCredentials: token ? true : false,
    baseURL: pagination ? pagination : process.env.REACT_APP_API_URL,
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
};

export const AxiosForm = (token, payload) =>
  axios.create({
    baseURL: process.env.REACT_APP_API_URL,
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
