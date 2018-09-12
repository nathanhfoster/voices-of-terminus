import React, { Component } from 'react'
import ImmutableProptypes from 'react-immutable-proptypes'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'
import {Navbar, Nav, NavItem, NavDropdown, Image} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import vrLogo from '../../images/VR_Logo.png'
import votLogo from '../../images/VoT-Logo-White.png'
import votLogoHover from '../../images/VoT-Logo-Orange-Border-White.png'

const mapStateToProps = () => ({
})

const mapDispatchToProps = {
}

class NavBar extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
    }
  }

  static propTypes = {
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
    this.setState({
      
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }
  
  componentWillUnmount() {
  }

  render() {
    const {navItem} = this.props
    return (
        <Navbar inverse collapseOnSelect className="NavBar">
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to ="/">
                <NavItem eventKey={1}><Image src={votLogo} height="50px" onMouseOver={e => e.currentTarget.src = votLogoHover} onMouseLeave={e => e.currentTarget.src = votLogo}/></NavItem>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to ="/articles"><NavItem eventKey={2}>ARTICLES</NavItem></LinkContainer>
              <LinkContainer to ="/calendar"><NavItem eventKey={3}>CALENDAR</NavItem></LinkContainer>
              <LinkContainer to ="/news/1"><NavItem eventKey={4}>NEWS</NavItem></LinkContainer>
              <NavDropdown eventKey={5} title="GUILD" id="basic-nav-dropdown">
                <LinkContainer to ="/guild/roster"><NavItem eventKey={5.1}>ROSTER</NavItem></LinkContainer>
                <LinkContainer to ="/guild/charters"><NavItem eventKey={5.2}>CHARTERS</NavItem></LinkContainer>
                <LinkContainer to ="/guild/lore"><NavItem eventKey={5.3}>LORE</NavItem></LinkContainer>
                <LinkContainer to ="/guild/contests"><NavItem eventKey={5.4}>CONTESTS</NavItem></LinkContainer>
                <LinkContainer to ="/guild/team"><NavItem eventKey={5.5}>TEAM</NavItem></LinkContainer>
                <LinkContainer to ="/guild/join"><NavItem eventKey={5.6}>JOIN</NavItem></LinkContainer>
              </NavDropdown>
              <NavDropdown eventKey={6} title="MEDIA" id="basic-nav-dropdown">
              <LinkContainer to ="/media/images"><NavItem eventKey={6.1}>IMAGES</NavItem></LinkContainer>
              <LinkContainer to ="/media/videos"><NavItem eventKey={6.2}>VIDEOS</NavItem></LinkContainer>
              <LinkContainer to ="/media/streams"><NavItem eventKey={6.3}>STREAMS</NavItem></LinkContainer>
              <LinkContainer to ="/media/podcasts"><NavItem eventKey={6.4}>PODCASTS</NavItem></LinkContainer>
            </NavDropdown>        
              <NavDropdown eventKey={7} title="VR" id="connect-nav-dropdown">
                <Image src={vrLogo} className="vrLogo"/>
                <NavItem eventKey={7.1} href="http://pantheonmmo.com/?referer=VoicesOfTerminus" target="_blank">WEBSITE</NavItem>
                <NavItem eventKey={7.2} href="http://visionaryrealms.com/?referer=VoicesOfTerminus" target="_blank">NEWS + EVENTS</NavItem>
                <NavItem eventKey={7.2} href="https://www.youtube.com/channel/UC4MbaiykerIrjKWRA6407tQ" target="_blank">GAMEPLAY</NavItem>
                <NavItem eventKey={7.3} href="http://www.pantheonmmo.com/news/latest_news/" target="_blank">NEWSLETTERS</NavItem>
              </NavDropdown>
              <LinkContainer to="/donate"><NavItem eventKey={9}>DONATE</NavItem></LinkContainer>
              <LinkContainer to ="/login"><NavItem eventKey={10}>Sing In/Up</NavItem></LinkContainer>
            </Nav>
          </Navbar.Collapse>
  </Navbar>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
