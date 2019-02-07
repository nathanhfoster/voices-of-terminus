import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";

export const setSettings = payload => dispatch =>
  dispatch({
    type: C.SET_SETTINGS,
    payload: payload
  });
