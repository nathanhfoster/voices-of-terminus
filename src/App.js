import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import Fadethrough from 'react-fadethrough'
import './App.css'
import { BrowserRouter as Router, Route } from "react-router-dom"
import { Image } from 'react-bootstrap'
import Articles from './views/Articles'
import Contests from './views/Contests'
import Guild from './views/Guild'
import Home from './views/Home'
import Join from './views/Join'
import Media from './views/Media'
import News from './views/News'
import Team from './views/Team'
import Login from './components/Login'
import Donate from './views/Donate'
import NavBar from './components/NavBar'
import bg1 from './images/bg1.jpg'
import bg2 from './images/bg2.jpg'
import bg3 from './images/bg3.jpg'
import bg4 from './images/bg4.jpg'
import Footer from './components/Footer'
import {setGuildMembers} from './actions'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
  setGuildMembers
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  static propTypes = {
    setGuildMembers: PropTypes.func.isRequired
  }

  static defaultProps = {
    routeItems: [
      {path: '/articles', component: Articles},
      {path: '/contests', component: Contests},
      {path: '/guild', component: Guild},
      {path: '/', component: Home},
      {path: '/join', component: Join},
      {path: '/media', component: Media},
      {path: '/news', component: News},
      {path: '/team', component: Team},
      {path: '/login', component: Login},
      {path: '/donate', component: Donate},
    ]
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    this.fetchGuildRoster("https://discordapp.com/api/guilds/161500442088439808/widget.json")
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
  }

  componentWillUnmount() {
  }

  fetchGuildRoster = (url) => {
    let req = new XMLHttpRequest()
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
          const discordData = JSON.parse(req.responseText)
          const discordMembers = Object.keys(discordData.members).map(i => { 
            discordData.members[i].guildMember = false
            if(discordData.members[i].nick && discordData.members[i].nick.includes("VoT")) {
              discordData.members[i].guildMember = true
            }
            return discordData.members[i]
          })
          const guildMembers = discordMembers.filter(i => i.guildMember)
          
          this.props.setGuildMembers(guildMembers)
          this.setState({ discordData, guildMembers })
        }
    }
    req.open("GET", url, true)
    req.send()
}

  renderRouteItems = routeItems => Object.keys(routeItems).map(k => {
    return (
      <Route exact path={routeItems[k].path} component={routeItems[k].component}/>
    )
  })

  render() {
    const {routeItems} = this.props
    return (
      <Router>
        <div className="App">
          <Fadethrough width={ '100%' } height={ '100%' } interval={ 14000 }>
            <Image src={ bg1 } width="100%" height="100%" />
            <Image src={ bg2 } width="100%" height="100%" />
            <Image src={ bg3 } width="100%" height="100%" />
            <Image src={ bg4 } width="100%" height="100%" />
          </Fadethrough>
          <NavBar />
          <Footer />
          <div className="routeOverlay">
            {this.renderRouteItems(routeItems)} 
          </div>
        </div>    
     </Router>
    )
  }
}
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(App)
