import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import storeFactory from './store'
import { Provider } from 'react-redux'

// Register service worker to control making site work offline

if('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/registerServiceWorker.js')
    .then(function() { console.log('Service Worker Registered') })
}

const initialState = (localStorage['redux-store'])? JSON.parse(localStorage['redux-store']) : {}
const store = storeFactory(initialState)
window.React = React
window.store = store

ReactDOM.render(
  <Provider store={store}>
  <App/>
  </Provider>, document.getElementById('root')
);
registerServiceWorker();

const saveState = () => {
    const state = JSON.stringify(store.getState())
    localStorage['redux-store'] = state
 }
 store.subscribe(saveState)