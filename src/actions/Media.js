import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const getGalleries = () => {
  return dispatch => {
    dispatch({ type: C.GET_GALLERIES_LOADING });
    return Axios()
      .get("galleries/")
      .then(res => {
        dispatch({
          type: C.GET_GALLERIES,
          payload: res.data
        });
      })
      .catch(e => dispatch({ type: C.GET_GALLERIES_ERROR, payload: e }));
  };
};

export const getGalleryImage = id => {
  return (dispatch, getState) => {
    Axios()
      .get(`galleries/${id}/image/`)
      .then(res => {
        const { id, image } = res.data;
        const { Galleries } = getState();
        let payload = { ...Galleries };
        const updatedIndex = payload.results.findIndex(
          gallery => gallery.id == id
        );
        payload.results[updatedIndex].image = image;
        dispatch({
          type: C.GET_GALLERIES,
          payload: payload
        });
      })
      .catch(e => dispatch({ type: C.GET_GALLERIES_ERROR, payload: e }));
  };
};

export const updateGallery = (id, token, payload) => {
  return (dispatch, getState) =>
    Axios(token)
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
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
};

export const deleteGallery = (id, token) => {
  return (dispatch, getState) =>
    Axios(token)
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
  return (dispatch, getState) => {
    Axios(token)
      .post("galleries/", qs.stringify(payload))
      .then(res => {
        const { Galleries } = getState();
        let payload = { ...Galleries };
        payload.results.unshift(res.data);
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
};

export const viewGalleryImages = id => {
  return dispatch => {
    dispatch({ type: C.GET_GALLERY_LOADING });
    Axios()
      .get(`gallery/images/${id}/view/`)
      .then(res => {
        dispatch({
          type: C.GET_GALLERY,
          payload: res.data
        });
      })
      .catch(e => dispatch({ type: C.GET_GALLERY_ERROR }));
  };
};

export const viewGalleryImage = id => {
  return (dispatch, getState) => {
    Axios()
      .get(`gallery/images/${id}/image/`)
      .then(res => {
        const { id, image } = res.data;
        const { Gallery } = getState().Galleries;
        let payload = { ...Gallery };
        const updatedIndex = payload.results.findIndex(
          gallery => gallery.id == id
        );
        payload.results[updatedIndex].image = image;
        dispatch({
          type: C.GET_GALLERY,
          payload: payload
        });
      })
      .catch(e => console.log(e));
  };
};

export const postGalleryImage = (token, payload) => {
  return (dispatch, getState) =>
    Axios(token)
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
  return (dispatch, getState) =>
    Axios(token)
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
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
};

export const deleteGalleryImage = (id, token) => {
  return (dispatch, getState) =>
    Axios(token)
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
