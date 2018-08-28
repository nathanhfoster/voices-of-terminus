import C from '../constants'
import appReducer from './reducers'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

const consoleMessages = store => next => action => {
  let result
  console.groupCollapsed(`dispatching action => ${action.type}`)
  console.log('current user', store.getState().currentUser)
  result = next(action)
  let { currentUser } = store.getState()

  console.log(`
     current user: ${currentUser}
     `)
   console.groupEnd()
   return result
 }

 export default (initialState={}) => {
   return applyMiddleware(thunk, consoleMessages)(createStore)(appReducer, initialState)
 }
