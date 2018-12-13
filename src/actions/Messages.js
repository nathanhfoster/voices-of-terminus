import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const getMessages = (userId, token) => {
  return dispatch =>
    Axios(token)
      .get(`/message/recipients/`)
      .then(messages => {
        console.log(messages);
      })
      .catch(e => console.log(e));
};
