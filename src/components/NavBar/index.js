import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { withAlert } from 'react-alert'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './styles.css'
import './stylesM.css'
import {Navbar, Nav, NavItem, NavDropdown, Image} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import vrLogo from '../../images/VR_Logo.png'
import votLogo from '../../images/VoT-Logo-White.png'
import votLogoHover from '../../images/VoT-Logo-Orange-Border-White.png'
import {Logout} from '../../actions/App'

import Cleric from '../../images/classIcons/cleric.png'
import Paladin from '../../images/classIcons/paladin.png'
import Warrior from '../../images/classIcons/warrior.png'
import DireLord from '../../images/classIcons/dire-lord.png'
import Ranger from '../../images/classIcons/ranger.png'
import Rogue from '../../images/classIcons/rogue.png'
import Monk from '../../images/classIcons/monk.png'
import Summoner from '../../images/classIcons/summoner.png'
import Enchanter from '../../images/classIcons/enchanter.png'
import Wizard from '../../images/classIcons/wizard.png'
import Druid from '../../images/classIcons/druid.png'
import Shaman from '../../images/classIcons/shaman.png'

const mapStateToProps = ({User}) => ({
  User
})

const mapDispatchToProps = {
  Logout
}

class NavBar extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = {
    Logout: PropTypes.func.isRequired
  }

  static defaultProps = {
    classIcon: {
      'Cleric': Cleric,
      'Paladin': Paladin,
      'Warrior': Warrior,
      'Dire Lord': DireLord,
      'Ranger': Ranger,
      'Rogue': Rogue,
      'Monk': Monk,
      'Summoner': Summoner,
      'Enchanter': Enchanter,
      'Wizard': Wizard,
      'Druid': Druid,
      'Shaman': Shaman
    }
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
    const {User} = props
    this.setState({User})
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }
  
  componentWillUnmount() {
  }

  Logout = () => {
    this.props.Logout()
    this.props.alert.show([
      <div>GOODBYE</div>
    ])
  }

  render() {
    const {pathname} = this.props.location
    const {User} = this.state
    const {token, id,  is_superuser, is_staff, bio, primary_role, primary_class} = User
    const {navItem, classIcon} = this.props
    return (
        <Navbar inverse collapseOnSelect className="NavBar">
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/">
                <NavItem eventKey={1}><Image src={votLogo} onMouseOver={e => e.currentTarget.src = votLogoHover} onMouseLeave={e => e.currentTarget.src = votLogo}/></NavItem>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/articles"><NavItem eventKey={2}>ARTICLES</NavItem></LinkContainer>
              <LinkContainer to="/calendar"><NavItem eventKey={3}>CALENDAR</NavItem></LinkContainer>
              <LinkContainer to="/news"><NavItem eventKey={4}>NEWS</NavItem></LinkContainer>
            { /* <LinkContainer to="/forums/"><NavItem eventKey={5}>FORUMS</NavItem></LinkContainer> */}
              <NavDropdown eventKey={5} title="GUILD" id="basic-nav-dropdown">
                <LinkContainer to="/guild/about"><NavItem eventKey={5.1}>ABOUT</NavItem></LinkContainer>
                <LinkContainer to="/guild/roster"><NavItem eventKey={5.2}>ROSTER</NavItem></LinkContainer>
                <LinkContainer to="/guild/charters"><NavItem eventKey={5.3}>CHARTERS</NavItem></LinkContainer>
                <LinkContainer to="/guild/lore"><NavItem eventKey={5.4}>LORE</NavItem></LinkContainer>
                <LinkContainer to="/guild/contests"><NavItem eventKey={5.5}>CONTESTS</NavItem></LinkContainer>
                <LinkContainer to="/guild/team"><NavItem eventKey={5.6}>TEAM</NavItem></LinkContainer>
                <LinkContainer to="/guild/join"><NavItem eventKey={5.7}>JOIN</NavItem></LinkContainer>
              </NavDropdown>
              <NavDropdown eventKey={6} title="MEDIA" id="basic-nav-dropdown">
              <LinkContainer to="/media/images"><NavItem eventKey={6.1}>IMAGES</NavItem></LinkContainer>
              <LinkContainer to="/media/videos"><NavItem eventKey={6.2}>VIDEOS</NavItem></LinkContainer>
              <LinkContainer to="/media/streams"><NavItem eventKey={6.3}>STREAMS</NavItem></LinkContainer>
              <LinkContainer to="/media/podcasts"><NavItem eventKey={6.4}>PODCASTS</NavItem></LinkContainer>
            </NavDropdown>        
              <NavDropdown eventKey={8} title="VR" id="connect-nav-dropdown">
                <Image src={vrLogo} className="vrLogo"/>
                <NavItem eventKey={8.1} href="http://pantheonmmo.com/?referer=VoicesOfTerminus" target="_blank">WEBSITE</NavItem>
                <NavItem eventKey={8.2} href="http://visionaryrealms.com/?referer=VoicesOfTerminus" target="_blank">NEWS + EVENTS</NavItem>
                <NavItem eventKey={8.2} href="https://www.youtube.com/channel/UC4MbaiykerIrjKWRA6407tQ" target="_blank">GAMEPLAY</NavItem>
                <NavItem eventKey={8.3} href="http://www.pantheonmmo.com/news/latest_news/" target="_blank">NEWSLETTERS</NavItem>
              </NavDropdown>
             
              {!User.token ? <LinkContainer to ="/login"><NavItem eventKey={10}>LOGIN</NavItem></LinkContainer>
              :<NavDropdown eventKey={5} title={classIcon[primary_class] ? <Image src={classIcon[primary_class]} style={{height: '25px'}}/> : <i className="fas fa-user"/>} id="basic-nav-dropdown">
                <LinkContainer to="/profile"><NavItem eventKey={6.7}>PROFILE</NavItem></LinkContainer>
                <NavItem onClick={this.Logout}>LOGOUT</NavItem>
              </NavDropdown>}
            </Nav>
            <Nav className="pull-right">
            {User.is_superuser ? <LinkContainer to="/admin"><NavItem eventKey={1}>ADMIN</NavItem></LinkContainer> : null}
            </Nav>
          </Navbar.Collapse>
  </Navbar>
    )
  }
}
export default withAlert(withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)))
