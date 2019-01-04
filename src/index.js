import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/AlertTemplate";
import registerServiceWorker from "./registerServiceWorker";
import storeFactory from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
require("dotenv").config();

const options = {
  position: "top left",
  //timeout: 3850,
  offset: "66px",
  transition: "scale"
};

// Register service worker to control making site work offline

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/registerServiceWorker.js")
    .then(function() {
      console.log("Service Worker Registered");
    });
}

const initialState = localStorage["redux-store"]
  ? JSON.parse(localStorage["redux-store"])
  : {};
const store = storeFactory(initialState);
// window.React = React
// window.store = store

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
  let state = JSON.stringify(store.getState());
  try {
    localStorage.setItem("redux-store", state);
  } catch (e) {
    if (isQuotaExceeded(e)) {
      // console.log(localStorage);
      // Storage full, maybe notify user or do some clean-up
      // localStorage.setItem('redux-store', {});
    }
  }

  function isQuotaExceeded(e) {
    var quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014:
            // Firefox
            if (e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
              quotaExceeded = true;
            }
            break;
        }
      } else if (e.number === -2147024882) {
        // Internet Explorer 8
        quotaExceeded = true;
      }
    }
    return quotaExceeded;
  }
};
store.subscribe(saveState);
