import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";
import { isEquivalent } from "../helpers";

const getGalleries = () => (dispatch, getState) => {
  dispatch({ type: C.GET_GALLERIES_LOADING });
  return Axios()
    .get("galleries/all/")
    .then(galleries => {
      const { Galleries } = getState();
      const hasImage = Galleries.results.every(gallery => gallery.image);
      if (
        !hasImage ||
        !isEquivalent(
          Galleries.results.map(k => k.id),
          galleries.data.results.map(k => k.id)
        ) ||
        !isEquivalent(
          Galleries.results.map(k => k.last_modified),
          galleries.data.results.map(k => k.last_modified)
        )
      ) {
        dispatch({
          type: C.GET_GALLERIES,
          payload: galleries.data
        });
      }
    })
    .catch(e => dispatch({ type: C.GET_GALLERIES_ERROR, payload: e }));
};

const getGalleryImage = id => (dispatch, getState) =>
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

const updateGallery = (id, token, payload) => (dispatch, getState) =>
  Axios(token)
    .patch(`galleries/${id}/`, qs.stringify(payload))
    .then(res => {
      const { Galleries } = getState();
      let payload = { ...Galleries };
      const updatedIndex = payload.results.findIndex(
        gallery => gallery.id == res.data.id
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

const deleteGallery = (id, token) => (dispatch, getState) =>
  Axios(token)
    .delete(`galleries/${id}/`)
    .then(res => {
      const { Galleries } = getState();
      res.data = { ...Galleries };
      res.data.results = res.data.results.filter(gallery => gallery.id != id);
      dispatch({
        type: C.GET_GALLERIES,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

const postGallery = (token, payload) => (dispatch, getState) => {
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

const viewGalleryImages = id => (dispatch, getState) => {
  dispatch({ type: C.GET_GALLERY_LOADING });
  Axios()
    .get(`gallery/images/${id}/view/`)
    .then(gallery => {
      const { Gallery } = getState().Galleries;
      const hasImage = Gallery.results.every(gallery => gallery.image);
      if (
        !hasImage ||
        !isEquivalent(
          Gallery.results.map(k => k.id),
          gallery.data.results.map(k => k.id)
        ) ||
        !isEquivalent(
          Gallery.results.map(k => k.last_modified),
          gallery.data.results.map(k => k.last_modified)
        ) ||
        !isEquivalent(
          Gallery.results.map(k => k.views),
          gallery.data.results.map(k => k.views)
        )
      ) {
        dispatch({
          type: C.GET_GALLERY,
          payload: gallery.data
        });
      }
    })
    .catch(e => dispatch({ type: C.GET_GALLERIES_ERROR, payload: e }));
};

const viewGalleryImage = id => (dispatch, getState) => {
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

const postGalleryImage = (token, payload) => (dispatch, getState) =>
  Axios(token)
    .post(`gallery/images/`, qs.stringify(payload))
    .then(res => {
      const { Gallery } = getState().Galleries;
      let payload = { ...Gallery };
      payload.results.unshift(res.data);
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

const updateGalleryImage = (id, token, payload) => (dispatch, getState) =>
  Axios(token)
    .patch(`gallery/images/${id}/`, qs.stringify(payload))
    .then(res => {
      const { Gallery } = getState().Galleries;
      let payload = { ...Gallery };
      const updatedIndex = payload.results.findIndex(
        gallery => gallery.id == res.data.id
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

const deleteGalleryImage = (id, token) => (dispatch, getState) =>
  Axios(token)
    .delete(`gallery/images/${id}/`)
    .then(res => {
      const { Gallery } = getState().Galleries;
      res.data = { ...Gallery };
      res.data.results = res.data.results.filter(gallery => gallery.id != id);
      dispatch({
        type: C.GET_GALLERY,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

const clearGalleryImages = () => ({ type: C.CLEAR_GALLERY });

export {
  getGalleries,
  getGalleryImage,
  updateGallery,
  deleteGallery,
  postGallery,
  viewGalleryImages,
  viewGalleryImage,
  postGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  clearGalleryImages
};
