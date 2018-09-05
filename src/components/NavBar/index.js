import React, { Component } from 'react'
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
  
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  getState = props => {
    this.setState({
      });
  }

  componentWillMount() {
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }
  
  componentWillUnmount() {
  }

  render() {
    const {navItems} = this.props
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
              <LinkContainer to ="/news"><NavItem eventKey={4}>NEWS</NavItem></LinkContainer>
              <NavDropdown eventKey={5} title="GUILD" id="basic-nav-dropdown">
                <LinkContainer to ="/guild/roster"><NavItem eventKey={5.1}>ROSTER</NavItem></LinkContainer>
                <LinkContainer to ="/guild/charters"><NavItem eventKey={5.2}>CHARTERS</NavItem></LinkContainer>
                <LinkContainer to ="/guild/lore"><NavItem eventKey={5.3}>LORE</NavItem></LinkContainer>
                <LinkContainer to ="/guild/contests"><NavItem eventKey={5.4}>CONTESTS</NavItem></LinkContainer>
                <LinkContainer to ="/guild/team"><NavItem eventKey={5.5}>TEAM</NavItem></LinkContainer>
                <LinkContainer to ="/guild/join"><NavItem eventKey={5.6}>JOIN</NavItem></LinkContainer>
              </NavDropdown>
              <LinkContainer to ="/media"><NavItem eventKey={7}>MEDIA</NavItem></LinkContainer>          
              <NavDropdown eventKey={7} title="VR" id="basic-nav-dropdown">
                <Image src={vrLogo} className="vrLogo"/>
                <NavItem eventKey={7.1} href="http://pantheonmmo.com/?referer=VoicesOfTerminus" target="_blank">WEBSITE</NavItem>
                <NavItem eventKey={7.2} href="http://visionaryrealms.com/?referer=VoicesOfTerminus" target="_blank">NEWS + EVENTS</NavItem>
                <NavItem eventKey={7.2} href="https://www.youtube.com/channel/UC4MbaiykerIrjKWRA6407tQ" target="_blank">GAMEPLAY</NavItem>
                <NavItem eventKey={7.3} href="http://www.pantheonmmo.com/news/latest_news/" target="_blank">NEWSLETTERS</NavItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={8} title="CONNECT" id="basic-nav-dropdown">
                <NavItem eventKey={8.1} href="http://discord.me/vot" class="fab fa-discord" target="_blank"><span> DISCORD</span></NavItem>
                <NavItem eventKey={8.2} href="http://twitch.tv/pantheon_vot" class="fab fa-twitch" target="_blank"><span> TWITCH</span></NavItem>
                <NavItem eventKey={8.3} href="https://www.youtube.com/channel/UCQ0BiIpfN9b5kUP8TA9eG1A" class="fab fa-youtube" target="_blank"><span> YOUTUBE</span></NavItem>
                <NavItem eventKey={8.4} href="https://www.facebook.com/VoicesofTerminus/" class="fab fa-facebook" target="_blank"><span> FACEBOOK</span></NavItem>
                <NavItem eventKey={8.5} href="http://twitter.com/pantheon_vot" class="fab fa-twitter" target="_blank"><span> TWITTER</span></NavItem>
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
