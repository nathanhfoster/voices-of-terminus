import { appReducer } from "./reducers";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
const { NODE_ENV, REACT_APP_API_URL } = process.env;

const consoleMessages = store => next => action => {
  const result = next(action);
  console.groupCollapsed(`dispatching action => ${action.type}`);
  // console.log('current user', store.getState().currentUser)
  // let { currentUser } = store.getState()
  // console.log(`current user: ${currentUser}`)
  console.groupEnd();
  return result;
};

export default (initialState = {}) => {
  const inDevelopmentMode = REACT_APP_API_URL.includes("localhost");
  // NODE_ENV == "development"
  return inDevelopmentMode
    ? composeWithDevTools(applyMiddleware(thunk))(createStore)(
        appReducer,
        initialState
      )
    : applyMiddleware(thunk)(createStore)(appReducer, initialState);
};
