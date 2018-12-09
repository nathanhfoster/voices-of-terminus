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

export const updateGallery = (id, token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .patch(`galleries/${id}/`, qs.stringify(payload))
      .then(res => {
        const { Galleries } = getState();
        let payload = { ...Galleries };
        const updatedIndex = payload.results.findIndex(
          gallery => gallery.id === res.data.id
        );
        payload.results[updatedIndex] = res.data;
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

export const deleteGallery = (id, token) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .delete(`galleries/${id}/`)
      .then(res => {
        const { Galleries } = getState();
        res.data = { ...Galleries };
        res.data.results = res.data.results.filter(
          gallery => gallery.id !== id
        );
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

export const updateGalleryImage = (id, token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .patch(`gallery/images/${id}/`, qs.stringify(payload))
      .then(res => {
        const { Gallery } = getState().Galleries;
        let payload = { ...Gallery };
        const updatedIndex = payload.results.findIndex(
          gallery => gallery.id === res.data.id
        );
        payload.results[updatedIndex] = res.data;
        dispatch({
          type: C.GET_GALLERY,
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

export const deleteGalleryImage = (id, token) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .delete(`gallery/images/${id}/`)
      .then(res => {
        const { Gallery } = getState().Galleries;
        res.data = { ...Gallery };
        res.data.results = res.data.results.filter(
          gallery => gallery.id !== id
        );
        dispatch({
          type: C.GET_GALLERY,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};
