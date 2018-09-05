import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import Fadethrough from 'react-fadethrough'
import './App.css'
import './AppM.css'
import { BrowserRouter as Router, Route } from "react-router-dom"
import { Image } from 'react-bootstrap'

import Home from './views/Home'
import Articles from './views/Articles'
import GuildCalendar from './views/GuildCalendar'
import News from './views/News'
import Guild from './views/Guild'
import Media from './views/Media'

import Login from './components/Login'
import Donate from './views/Donate'
import NavBar from './components/NavBar'

import bg1 from './images/bg1.jpg'
import bg2 from './images/bg2.jpg'
import bg3 from './images/bg3.jpg'
import bg4 from './images/bg4.jpg'
import bg5 from './images/bg5.jpg'
import bg6 from './images/bg6.jpg'
import bg7 from './images/bg7.jpg'
import bg1Mobile from './images/bg1M.png'
import bg2Mobile from './images/bg2M.png'
import bg3Mobile from './images/bg3M.png'
import bg4Mobile from './images/bg4M.png'
import bg5Mobile from './images/bg5M.png'
import bg6Mobile from './images/bg6M.png'
// import bg1Mobile from './images/bg1-mobile.jpg'
// import bg2Mobile from './images/bg2-mobile.jpg'
// import bg3Mobile from './images/bg3-mobile.jpg'
// import bg4Mobile from './images/bg4-mobile.jpg'
// import bg5Mobile from './images/bg5-mobile.jpg'
import Footer from './components/Footer'
import {setGuildMembers, setWindow, getWindow} from './actions'

const mapStateToProps = ({ Window }) => ({
  Window
})

const mapDispatchToProps = {
  setWindow,
  getWindow,
  setGuildMembers
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      width: 0,
      height: 0 ,
      isMobile: false
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  static propTypes = {
    setWindow: PropTypes.func.isRequired,
    getWindow: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    isMobile: PropTypes.bool,
    setGuildMembers: PropTypes.func.isRequired,
    routeItems: PropTypes.array,
    images: PropTypes.array,
    imagesMobile: PropTypes.array
  }

  static defaultProps = {
    routeItems: [
      {path: '/', component: Home},
      {path: '/articles', component: Articles},
      {path: '/calendar', component: GuildCalendar},
      {path: '/news', component: News},
      {path: '/guild/roster', component: Guild},
      {path: '/guild/charters', component: Guild},
      {path: '/guild/lore', component: Guild},
      {path: '/guild/contests', component: Guild},
      {path: '/guild/team', component: Guild},
      {path: '/guild/join', component: Guild},
      {path: '/media', component: Media},
      {path: '/login', component: Login},
      {path: '/donate', component: Donate},
    ],
    images: [bg1, bg2, bg3, bg4, bg5, bg6, bg7],
    imagesMobile: [bg1Mobile, bg2Mobile, bg3Mobile, bg4Mobile, bg5Mobile, bg6Mobile]
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
    this.props.getWindow()
    this.fetchGuildRoster("https://discordapp.com/api/guilds/161500442088439808/widget.json")
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Window} = props
    //console.log('props: ', props)
    this.setState({Window})
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    const { innerHeight, innerWidth } = window
    const isMobile = innerWidth < 676
    this.props.setWindow({ innerHeight, innerWidth, isMobile })
    this.setState({height: innerHeight, width: innerWidth, isMobile})
  }

  fetchGuildRoster = (url) => {
    fetch(url).then(Response => {
      Response.json()
      .then(discordData => {
        const discordMembers = Object.keys(discordData.members).map(i => { 
          discordData.members[i].guildMember = false
          if(discordData.members[i].nick && discordData.members[i].nick.includes("VoT")) {
            discordData.members[i].guildMember = true
          }
          // Remove <VoT>
          discordData.members[i].nick ? discordData.members[i].nick = discordData.members[i].nick.replace('<VoT>', '').replace(/[^\x00-\x7F]/g, '') : null
          return discordData.members[i]
        })
        const guildMembers = discordMembers.filter(i => i.guildMember)
          
          this.props.setGuildMembers(guildMembers)
          this.setState({ discordData, guildMembers })
      })
    })

    // let req = new XMLHttpRequest()
    // req.onreadystatechange = () => {
    //     if (req.readyState == 4 && req.status == 200) {
    //       const discordData = JSON.parse(req.responseText)
    //       const discordMembers = Object.keys(discordData.members).map(i => { 
    //         discordData.members[i].guildMember = false
    //         if(discordData.members[i].nick && discordData.members[i].nick.includes("VoT")) {
    //           discordData.members[i].guildMember = true
    //         }
    //         return discordData.members[i]
    //       })
    //       const guildMembers = discordMembers.filter(i => i.guildMember)
          
    //       this.props.setGuildMembers(guildMembers)
    //       this.setState({ discordData, guildMembers })
    //     }
    // }
    // req.open("GET", url, true)
    // req.send()
}

  renderRouteItems = routeItems => routeItems.map(k => {
    return (
      <Route exact path={k.path} component={k.component}/>
    )
  })

  renderBackgroundImages = (images, shouldRespond) => images.map(k => {
    return (
      <Image src={k} width="100%" height="100%" responsive={shouldRespond}/>
    )
  })

  render() {
    const {isMobile} = this.state
    const {routeItems, images, imagesMobile} = this.props
    return (
      <Router>
        <div className="App">
          <NavBar />
          <div className="fadeThrough">
            <Fadethrough interval={14000}>
              {isMobile ? this.renderBackgroundImages(imagesMobile, true) : this.renderBackgroundImages(images, false)}
            </Fadethrough>
          </div>
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