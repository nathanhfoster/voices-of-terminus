import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { withAlert } from 'react-alert'
import Cookies from 'js-cookie'
import './App.css'
import './AppM.css'
import "regenerator-runtime/runtime"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Image } from 'react-bootstrap'

import Admin from './views/Admin'
import BackgroundImage from './components/BackgroundImage'
import UserProfile from './views/Admin/UserProfile'
import NavBar from './components/NavBar'
import Home from './views/Home'
import Articles from './views/Articles'
import TextEditor from './components/TextEditor'
import NewsLetterGenerator from './components/NewsLetterGenerator'
import GuildCalendar from './views/GuildCalendar'
import News from './views/News'
import HtmlParser from './components/HtmlParser'
import Forums from './views/Forums'
import Guild from './views/Guild'
import Media from './views/Media'
import VideoPlayer from './components/VideoPlayer'
import Profile from './views/Profile'
import Login from './components/Login'
import Donate from './views/Donate'
import PageNotFound from './views/PageNotFound'
import Footer from './components/Footer'
import {clearApiResponse, setWindow, getVoTYouTubeChannelData, getAllVRYouTube, getVRYouTubeChannelData, Logout} from './actions/App'
import {getUser} from './actions/Admin'
import 'moment-timezone'
import MomentJS from 'moment'

const mapStateToProps = ({ApiResponse, Window, User, VoTYouTubeChannelData, VRYouTubeChannelData}) => ({
  ApiResponse,
  Window,
  User,
  VoTYouTubeChannelData,
  VRYouTubeChannelData
})

const mapDispatchToProps = {
  clearApiResponse,
  setWindow,
  getVoTYouTubeChannelData,
  getAllVRYouTube,
  getVRYouTubeChannelData,
  Logout,
  getUser
}

class App extends Component {
  constructor(props) {
    super(props)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)

    this.state = { 
      width: null,
      height: null,
      isMobile: false,
      User: {},
      update: 0,
    }
  }

  static propTypes = {
    setWindow: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    isMobile: PropTypes.bool,
    User: PropTypes.object,
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
      {path: '/admin', component: Admin},
      {path: '/admin/user/profile/:id', component: UserProfile},
      {path: '/articles', component: Articles},
      {path: '/articles/:id', component: HtmlParser},
      {path: '/articles/new/article', component: TextEditor},
      {path: '/articles/edit/article/:id', component: TextEditor},
      {path: '/articles/view/:id', component: Articles},
      {path: '/calendar', component: GuildCalendar},
      {path: '/news/', component: News},
      {path: '/news/:id', component: HtmlParser},
      {path: '/articles/new/newsletter', component: NewsLetterGenerator},
      {path: '/articles/edit/newsletter/:id', component: NewsLetterGenerator},
      {path: '/forums/', component: Forums},
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
      {path: '/profile', component: Profile},
      {path: '/login', component: Login},
      {path: '/donate', component: Donate},
    ],
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const {VoTYouTubeChannelData, VRYouTubeChannelData, User} = this.props
    if(this.shouldUpdate(VoTYouTubeChannelData[0])) this.props.getVoTYouTubeChannelData()
    if(this.shouldUpdate(VRYouTubeChannelData[0])) this.props.getAllVRYouTube()
    this.props.getVRYouTubeChannelData()
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
    /* Check if User permissions have changed every 10 seconds */
    if(User.hasOwnProperty('id')) this.interval = setInterval(() => this.props.getUser(User.id), 10000)
  }
  /* If youtubeData exists ? update it if the latest video is 3 days old : else update it */
  shouldUpdate = youtubeData => youtubeData ? MomentJS().diff(MomentJS(youtubeData.publishedAt), 'days') > 3 : true

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {ApiResponse, Window, User} = props
    if(ApiResponse) this.alertApiResponse(ApiResponse)
    this.setState({ApiResponse, Window, User})
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
    // if cookie is expired and redux has User data remove it by logging out
    if(!Cookies.get('User_LoginToken') && this.props.User.token) this.props.Logout()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
    clearInterval(this.interval)
  }

  alertApiResponse = ApiResponse => {
    const {data, status, statusText, headers, config, request} = ApiResponse
    const {alert} = this.props

    if(status === 200 || status === 201) alert.success([<div>{status} {statusText}</div>])
    if(status === 400 || status === 401) alert.error([<div>{status} {statusText}</div>, <div>{JSON.stringify(data)}</div>])
       
    this.props.clearApiResponse()
  }

  updateWindowDimensions() {
    const { innerHeight, innerWidth } = window
    const isMobile = innerWidth < 768
    this.props.setWindow({ innerHeight, innerWidth, isMobile })
    this.setState({height: innerHeight, width: innerWidth, isMobile})
  }

  renderRouteItems = routeItems => routeItems.map(k => <Route exact path={k.path} component={k.component}/>)

  renderBackgroundImages = (images, shouldRespond) => images.map(k => (<Image src={k} width="100%" height="100%" responsive={shouldRespond}/>))

  render() {
    const {ApiResponse, isMobile} = this.state
    const {routeItems, images, imagesMobile} = this.props
    return (
      <Router>
        <div className="App">
          <NavBar />
          <BackgroundImage />
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
 
export default withAlert(reduxConnect(mapStateToProps, mapDispatchToProps)(App))