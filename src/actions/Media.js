import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const getGalleries = () => {
  return async dispatch =>
    await Axios()
      .get("galleries/")
      .then(res => {
        dispatch({
          type: C.GET_GALLERIES,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const postGallery = (token, payload) => {
  return async (dispatch, getState) => {
    await Axios(token)
      .post("galleries/", qs.stringify(payload))
      .then(res => {
        const { Galleries } = getState();
        let payload = { ...Galleries };
        payload.results.unshift(res.data);
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

export const viewGalleryImages = id => {
  return async dispatch => {
    await Axios()
      .get(`gallery/images/${id}/view/`)
      .then(res => {
        dispatch({
          type: C.GET_GALLERY,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
  };
};

export const postGalleryImage = (token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .post(`gallery/images/`, qs.stringify(payload))
      .then(res => {
        const { Galleries } = getState();
        let payload = { ...Galleries };
        payload.Gallery.results.unshift(res.data);
        dispatch({
          type: C.GET_GALLERIES,
          payload: payload
        });
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
};
