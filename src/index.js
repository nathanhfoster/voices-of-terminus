import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import registerServiceWorker from './registerServiceWorker'
import storeFactory from './store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router} from "react-router-dom"
require('dotenv').config()

const options = {
  position: 'bottom center',
  timeout: 1250,
  offset: '30px',
  transition: 'scale'
}

// Register service worker to control making site work offline

if('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/registerServiceWorker.js')
    .then(function() { console.log('Service Worker Registered') })
}

const initialState = (localStorage['redux-store']) ? JSON.parse(localStorage['redux-store']) : {}
const store = storeFactory(initialState)
// window.React = React
// window.store = store

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </Router>
  </Provider>, document.getElementById('root')
)
registerServiceWorker()

  const saveState = () => {
    const state = JSON.stringify(store.getState())
    localStorage['redux-store'] = state
  }
  store.subscribe(saveState)
