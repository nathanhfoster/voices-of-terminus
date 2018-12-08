import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const postGallery = (token, payload) => {
  console.log(payload);
  return async (dispatch, getState) => {
    await AxiosForm(token, payload)
      .post("galleries/")
      .then(res => {
        console.log(res);
        const { Galleries } = getState();
        let payload = { ...Galleries };
        payload.results.push(res.data);
        dispatch({
          type: C.GET_GALLERIES,
          payload: payload
        });
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: res
        });
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
  };
};
