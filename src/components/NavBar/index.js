import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Image} from 'react-bootstrap'

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
        <Navbar inverse collapseOnSelect className="NavBarContainer">
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">VoT</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="news">
                NEWS
              </NavItem>
              <NavItem eventKey={2} href="/guild">GUILD</NavItem>
              <NavItem eventKey={3} href="/contests">CONTESTS</NavItem>
              <NavItem eventKey={4} href="/media">MEDIA</NavItem>
              <NavItem eventKey={5} href="/articles">ARTICLES</NavItem>
              <NavItem eventKey={6} href="/team">TEAM</NavItem>
              <NavDropdown eventKey={7} title="VR" id="basic-nav-dropdown">
                <MenuItem eventKey={7.1} href="http://pantheonmmo.com/?referer=VoicesOfTerminus" target="_blank">WEBSITE</MenuItem>
                <MenuItem eventKey={7.2} href="http://visionaryrealms.com/?referer=VoicesOfTerminus" target="_blank">NEWS + EVENTS</MenuItem>
              </NavDropdown>
              <NavItem eventKey={8} href="/join">
                JOIN
              </NavItem>
              <NavItem eventKey={9} href="/login">
                Sing In/Up
              </NavItem>
            </Nav>
            <Nav pullRight>
            <NavDropdown eventKey={7} title="CONNECT" id="basic-nav-dropdown">
              <NavItem eventKey={10} href="http://discord.me/vot" class="fab fa-discord" target="_blank"><span> DISCORD</span></NavItem>
              <NavItem eventKey={11} href="http://twitch.tv/pantheon_vot" class="fab fa-twitch" target="_blank"><span> TWITCH</span></NavItem>
              <NavItem eventKey={12} href="https://www.youtube.com/channel/UCQ0BiIpfN9b5kUP8TA9eG1A" class="fab fa-youtube" target="_blank"><span> YOUTUBE</span></NavItem>
              <NavItem eventKey={13} href="https://www.facebook.com/VoicesofTerminus/" class="fab fa-facebook" target="_blank"><span> FACEBOOK</span></NavItem>
              <NavItem eventKey={14} href="http://twitter.com/pantheon_vot" class="fab fa-twitter" target="_blank"><span> TWITTER</span></NavItem>
            </NavDropdown>
            </Nav>
          </Navbar.Collapse>
  </Navbar>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
