import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/AlertTemplate";
import registerServiceWorker from "./registerServiceWorker";
import storeFactory from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Cookies from "js-cookie";
import { LastStoreUpdated } from "./helpers/variables";
import "./index.css";
import "./App.css";
import "./AppM.css";
require("dotenv").config();

const options = {
  position: "top center",
  timeout: 3850,
  offset: "calc(var(--navBarHeight) + 10px)",
  transition: "scale"
};

// Register service worker to control making site work offline

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/registerServiceWorker.js")
    .then(() => {
      console.log("Service Worker Registered");
    })
    .catch(e => console.log("Service Worker Did Not Register"));
}

const getState = () => {
  const UserLastActive = new Date(Cookies.get("STORE_UPDATED") || 0);
  const shouldResetStore = UserLastActive - LastStoreUpdated < 0;
  if (shouldResetStore) {
    localStorage.clear();
    Cookies.set("STORE_UPDATED", new Date());
  } else if (localStorage["redux-store"]) {
    return JSON.parse(localStorage["redux-store"]);
  }
  return {};
};

const initialState = getState();

const store = storeFactory(initialState);

export const ReduxStore = store;

const Clean = array => {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (item.hasOwnProperty("html")) delete item.html;
    if (item.hasOwnProperty("image")) delete item.image;
  }
  return array.filter(e => e);
};

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();

const saveState = () => {
  let reduxStore = store.getState();
  let state = JSON.stringify(reduxStore);
  try {
    localStorage.setItem("redux-store", state);
  } catch (e) {
    if (isQuotaExceeded(e)) {
      // console.log(localStorage);
      // if (reduxStore.Articles.hasOwnProperty("results"))
      //   reduxStore.Articles.results = Clean(reduxStore.Articles.results);
      // if (reduxStore.Newsletters.hasOwnProperty("results"))
      //   reduxStore.Newsletters.results = Clean(reduxStore.Newsletters.results);
      // if (reduxStore.Galleries.hasOwnProperty("results"))
      //   reduxStore.Galleries.results = Clean(reduxStore.Galleries.results);
    }
  }
};
const isQuotaExceeded = e => {
  let quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name == "NS_ERROR_DOM_QUOTA_REACHED") {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number == -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
};

store.subscribe(saveState);
