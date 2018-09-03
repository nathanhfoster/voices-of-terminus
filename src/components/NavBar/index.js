import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { Link } from 'react-router-dom'
import './styles.css'
import './stylesM.css'
import {Navbar, Nav, NavItem, NavDropdown, Image} from 'react-bootstrap'
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
              <Link to ="/"><Image src={votLogo} height="50px" onMouseOver={e => e.currentTarget.src = votLogoHover} onMouseLeave={e => e.currentTarget.src = votLogo}/></Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1}><Link to ="/articles">ARTICLES</Link></NavItem>
              <NavItem eventKey={2}><Link to ="/calendar">CALENDAR</Link></NavItem>
              <NavItem eventKey={3}><Link to ="/news">NEWS</Link></NavItem>
              <NavDropdown eventKey={4} title="GUILD" id="basic-nav-dropdown">
                <NavItem eventKey={5.1}><Link to ="/guild/roster">ROSTER</Link></NavItem>
                <NavItem eventKey={5.2}><Link to ="/guild/charters">CHARTERS</Link></NavItem>
                <NavItem eventKey={5.3}><Link to ="/guild/lore">LORE</Link></NavItem>
                <NavItem eventKey={5.4}><Link to ="/guild/contests">CONTESTS</Link></NavItem>
                <NavItem eventKey={5.5}><Link to ="/guild/team">TEAM</Link></NavItem>
                <NavItem eventKey={5.6}><Link to ="/guild/join">JOIN</Link></NavItem>
              </NavDropdown>
              <NavItem eventKey={6}><Link to ="/media">MEDIA</Link></NavItem>             
              <NavDropdown eventKey={7} title="VR" id="basic-nav-dropdown">
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
              <NavItem componentClass={Link} eventKey={9} to="/donate" href="/donate">DONATE</NavItem>
              <NavItem eventKey={10}><Link to ="/login">Sing In/Up</Link></NavItem>
            </Nav>
          </Navbar.Collapse>
  </Navbar>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
