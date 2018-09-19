import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import Fadethrough from 'react-fadethrough'
import './App.css'
import './AppM.css'
import "regenerator-runtime/runtime"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Image } from 'react-bootstrap'

import NavBar from './components/NavBar'
import Home from './views/Home'
import Articles from './views/Articles'
import GuildCalendar from './views/GuildCalendar'
import News from './views/News'
import Guild from './views/Guild'
import Media from './views/Media'
import VideoPlayer from './components/VideoPlayer'
import Login from './components/Login'
import Donate from './views/Donate'
import PageNotFound from './views/PageNotFound'

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
import {setWindow, getVoTYouTubeChannelData, getAllVRYouTube, getVRYouTubeChannelData} from './actions/App'

const mapStateToProps = ({ Window }) => ({
  Window
})

const mapDispatchToProps = {
  setWindow,
  getVoTYouTubeChannelData,
  getAllVRYouTube,
  getVRYouTubeChannelData
}

class App extends Component {
  constructor(props) {
    super(props)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)

    this.state = { 
      width: 0,
      height: 0 ,
      isMobile: false
    }
  }

  static propTypes = {
    setWindow: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    isMobile: PropTypes.bool,
    getVoTYouTubeChannelData: PropTypes.func.isRequired,
    getAllVRYouTube: PropTypes.func.isRequired,
    getVRYouTubeChannelData: PropTypes.func.isRequired,
    routeItems: PropTypes.array,
    images: PropTypes.array,
    imagesMobile: PropTypes.array
  }

  static defaultProps = {
    routeItems: [
      {path: '/', component: Home},
      {path: '/articles', component: Articles},
      {path: '/calendar', component: GuildCalendar},
      {path: '/news/:id', component: News},
      {path: '/guild/about', component: Guild},
      {path: '/guild/roster', component: Guild},
      {path: '/guild/charters', component: Guild},
      {path: '/guild/lore', component: Guild},
      {path: '/guild/contests', component: Guild},
      {path: '/guild/team', component: Guild},
      {path: '/guild/join', component: Guild},
      {path: '/media/images', component: Media},
      {path: '/media/videos', component: Media},
      {path: '/media/videos/:id', component: VideoPlayer},
      {path: '/media/streams', component: Media},
      {path: '/media/podcasts', component: Media},
      {path: '/login', component: Login},
      {path: '/donate', component: Donate}
    ],
    images: [bg1, bg2, bg3, bg4, bg5, bg6, bg7],
    imagesMobile: [bg1Mobile, bg2Mobile, bg3Mobile, bg4Mobile, bg5Mobile, bg6Mobile]
  }

  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  componentWillUpdate() {
  }

  /* render() */

  componentDidMount() {
    this.props.getVoTYouTubeChannelData()
    this.props.getAllVRYouTube()
    this.props.getVRYouTubeChannelData()
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Window} = props
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

  renderRouteItems = routeItems => routeItems.map(k => (<Route exact path={k.path} component={k.component}/>))

  renderBackgroundImages = (images, shouldRespond) => images.map(k => (<Image src={k} width="100%" height="100%" responsive={shouldRespond}/>))

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
            <Switch>
              {this.renderRouteItems(routeItems)} 
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </div>    
     </Router>
    )
  }
}
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(App)