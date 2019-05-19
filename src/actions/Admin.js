import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";
import { DeepCopy, GetUserPermissions } from "../helpers";

const changeGroups = (token, id, payload) => (dispatch, getState) => {
  const { Users } = getState().Admin;
  let usersPayload = DeepCopy(Users);
  return Axios(token)
    .post(`user-groups/${id}/add/`, qs.stringify(payload))
    .then(res => {
      const userIndex = usersPayload.findIndex(user => user.id == id);
      usersPayload[userIndex].groups = JSON.parse(res.data);
      dispatch({
        type: C.UPDATE_USERS_SUCCESS,
        payload: usersPayload
      });
      dispatch({
        type: C.GET_USER,
        payload: usersPayload[userIndex]
      });
    })
    .catch(e => console.log(e));
};

const changePermissions = (token, id, payload) => (dispatch, getState) => {
  const { Users } = getState().Admin;
  let usersPayload = DeepCopy(Users);
  return Axios(token)
    .post(`user-permissions/${id}/add/`, qs.stringify(payload))
    .then(res => {
      const userIndex = usersPayload.findIndex(user => user.id == id);
      usersPayload[userIndex].user_permissions = JSON.parse(res.data);
      dispatch({
        type: C.UPDATE_USERS_SUCCESS,
        payload: usersPayload
      });
      dispatch({
        type: C.GET_USER,
        payload: usersPayload[userIndex]
      });
    })
    .catch(e => console.log(e));
};

const getUsersWithProfileImages = () => dispatch =>
  Axios()
    .get("users/")
    .then(res => {
      dispatch({
        type: C.GET_USERS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

const getUsers = () => dispatch =>
  Axios()
    .get("users/all/")
    .then(res => getUsersCharactersAndPermissions(res.data, dispatch))
    .catch(e => console.log(e));

const getUsersCharactersAndPermissions = (Users, dispatch) => {
  Axios()
    .get(`user/characters/`)
    .then(res => {
      const Characters = res.data;
      const payload = Users.map(user => {
        user.Characters = Characters.filter(c => c.author == user.id);
        user.permissions = GetUserPermissions(user.user_permissions);
        return user;
      });
      dispatch({
        type: C.GET_USERS,
        payload: payload
      });
    })
    .catch(e => console.log(e));
};

const clearUser = () => dispatch =>
  dispatch({
    type: C.CLEAR_USER
  });

const clearAdminApi = () => dispatch =>
  dispatch({
    type: C.CLEAR_ADMIN_API
  });

const updateUserProfile = (id, token, payload) => (dispatch, getState) => {
  dispatch({ type: C.UPDATE_USERS_LOADING });
  const { Users } = getState().Admin;
  let usersPayload = DeepCopy(Users);
  return Axios(token)
    .patch(`users/${id}/`, qs.stringify(payload))
    .then(res => {
      const userIndex = usersPayload.findIndex(user => user.id == res.data.id);
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

const createUser = payload => (dispatch, getState) =>
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

const deleteUser = (token, id) => (dispatch, getState) =>
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

export {
  changeGroups,
  changePermissions,
  getUsersWithProfileImages,
  getUsers,
  getUsersCharactersAndPermissions,
  clearUser,
  clearAdminApi,
  updateUserProfile,
  createUser,
  deleteUser
};
