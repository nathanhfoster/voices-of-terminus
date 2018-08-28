import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import Fadethrough from 'react-fadethrough'
import './App.css'
import { BrowserRouter as Router, Route } from "react-router-dom"
//import JobMap from './views/GoogleMap'
import Home from './views/Home'
import Login from './components/Login'
import BotNavBar from './components/NavBar'
import bg1 from './images/bg1.jpg'
import bg2 from './images/bg2.jpg'
import bg3 from './images/bg3.jpg'
import bg4 from './images/bg4.jpg'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {

}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }


  static propTypes = {
  }

  static defaultProps = {

  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
  }

  componentWillUnmount() {
  }

  render() {

    return (
      <Router>
        <div className="App">
        <Fadethrough width={ '100%' } height={ '100%' } interval={ 14000 }>
          <img src={ bg1 } width="100%" height="100%" />
          <img src={ bg2 } width="100%" height="100%" />
          <img src={ bg3 } width="100%" height="100%" />
          <img src={ bg4 } width="100%" height="100%" />
        </Fadethrough>
          <BotNavBar />
          <div className="routeOverlay">
            <Route exact path="/" component={Home}/>
            <Route path="/Location" component={Location}/>
            <Route path="/Login" component={Login}/>
          </div>
        </div>
     </Router>
    )
  }
}
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(App)
