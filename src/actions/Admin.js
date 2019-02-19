import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";
import { User } from "../store/reducers";

export const getUsersWithProfileImages = () => {
  return dispatch =>
    Axios()
      .get("users/")
      .then(res => {
        dispatch({
          type: C.GET_USERS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const getUsers = () => {
  return dispatch =>
    Axios()
      .get("users/all/")
      .then(res => getUsersCharacters(res.data, dispatch))
      .catch(e => console.log(e));
};

const getUsersCharacters = (Users, dispatch) => {
  Axios()
    .get(`characters/`)
    .then(res => {
      const Characters = res.data;
      let payload = Users.map(u => {
        u.Characters = Characters.filter(c => c.author === u.id);
        return u;
      });
      dispatch({
        type: C.GET_USERS,
        payload: payload
      });
    })
    .catch(e => console.log(e));
};

export const clearUser = () => {
  return dispatch =>
    dispatch({
      type: C.CLEAR_USER
    });
};

export const clearAdminApi = () => {
  return dispatch =>
    dispatch({
      type: C.CLEAR_ADMIN_API
    });
};

export const updateUserProfile = (id, token, payload) => {
  return (dispatch, getState) => {
    dispatch({ type: C.UPDATE_USERS_LOADING });
    const { Users } = getState().Admin;
    let usersPayload = [...Users];
    Axios(token)
      .patch(`users/${id}/`, qs.stringify(payload))
      .then(res => {
        const userIndex = usersPayload.findIndex(
          user => user.id === res.data.id
        );
        usersPayload[userIndex] = res.data;
        dispatch({
          type: C.UPDATE_USERS_SUCCESS,
          payload: usersPayload
        });
        dispatch({
          type: C.GET_USER,
          payload: res.data
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

export const createUser = payload => {
  return (dispatch, getState) =>
    AxiosForm(null, payload)
      .post("users/", payload)
      .then(res => {
        let { Users } = getState().Admin;
        Users.push(res.data);
        dispatch({
          type: C.GET_USERS,
          payload: Users
        });
      })
      .catch(e => console.log(e));
};

export const deleteUser = (token, id) => {
  return (dispatch, getState) =>
    Axios(token)
      .delete(`users/${id}/`)
      .then(res => {
        let { Users } = getState().Admin;
        Users = Users.filter(user => user.id !== id);
        dispatch({
          type: C.GET_USERS,
          payload: Users
        });
      })
      .catch(e => console.log(e));
};
