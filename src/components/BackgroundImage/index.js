import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Image} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import './styles.css'
import './stylesM.css'
import bg1 from '../../images/bg1.jpg'
import bg2 from '../../images/bg2.jpg'
import bg3 from '../../images/bg3.jpg'
import bg4 from '../../images/bg4.jpg'
import bg5 from '../../images/bg5.jpg'
import bg6 from '../../images/bg6.jpg'
import bg7 from '../../images/bg7.jpg'
import bg1M from '../../images/bg1M.png'
import bg2M from '../../images/bg2M.png'
import bg3M from '../../images/bg3M.png'
import bg4M from '../../images/bg4M.png'
import bg5M from '../../images/bg5M.png'
import bg6M from '../../images/bg6M.png'
// import bg1Mobile from './images/bg1-mobile.jpg'
// import bg2Mobile from './images/bg2-mobile.jpg'
// import bg3Mobile from './images/bg3-mobile.jpg'
// import bg4Mobile from './images/bg4-mobile.jpg'
// import bg5Mobile from './images/bg5-mobile.jpg'

const mapStateToProps = ({Window}) => ({
  Window
})

const mapDispatchToProps = {
}

class BackgroundImage extends Component {
  constructor(props) {
    super(props)
 
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
    const {history, location, match} = props
    const {isMobile} = props.Window
    this.setState({history, location, match, isMobile})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  backgroundImageRouteMap = route => {
    switch(route) {
      case '/': return bg2
      case '/articles': return bg2
      case '/calendar': return bg2
      case '/news': return bg5
      case '/guild/about': return bg4
      case '/guild/roster': return bg3
      case '/guild/charters': return bg3
      case '/guild/lore': return bg3
      case '/guild/contests': return bg3
      case '/guild/team': return bg3
      case '/guild/join': return bg3
      case '/login': return bg7
      default: return bg3
    }
  }

  backgroundMobileImageRouteMap = route => {
    switch(route) {
      case '/': return bg1M
      case '/articles': return bg2M
      case '/calendar': return bg3M
      case '/news': return bg4M
      case '/guild/about': return bg5M
      case '/guild/roster': return bg5M
      case '/guild/charters': return bg5M
      case '/guild/lore': return bg5M
      case '/guild/contests': return bg5M
      case '/guild/team': return bg5M
      case '/guild/join': return bg5M
      case '/login': return bg2M
      default: return bg6M
    }
  }


  render() {
    const {history, location, match, isMobile} = this.state
    const {pathname} = location
    const bgImage = isMobile ? this.backgroundMobileImageRouteMap(pathname) : this.backgroundImageRouteMap(pathname)
    return (
      <div className="BackgroundImage">
        <Image src={bgImage}/>
      </div>
       )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(BackgroundImage))