import C from "../constants";
import { Axios } from "./Axios";

const getAllUserGroups = () => dispatch => {
  return Axios()
    .get(`user-groups/`)
    .then(res => {
      dispatch({
        type: C.GET_ALL_USER_GROUPS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const getAllUserPermissions = () => dispatch =>
  Axios()
    .get(`user-permissions/`)
    .then(res => {
      dispatch({
        type: C.GET_ALL_USER_PERMISSIONS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

export { getAllUserGroups, getAllUserPermissions };
