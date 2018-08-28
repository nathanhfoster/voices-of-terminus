import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import {Link} from "react-router-dom"
import './styles.css'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faNewspaper from '@fortawesome/fontawesome-free-solid/faNewspaper'
import faGamepad from '@fortawesome/fontawesome-free-solid/faGamepad'
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers'
import faIdCard from '@fortawesome/fontawesome-free-solid/faIdCard'
import faBook from '@fortawesome/fontawesome-free-solid/faBookmark'
import faUserCircle from '@fortawesome/fontawesome-free-solid/faUserCircle'
import faExternalLinkAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkAlt'
import faSignInAlt from '@fortawesome/fontawesome-free-solid/faSignInAlt'
import faFilm from '@fortawesome/fontawesome-free-solid/faFilm'
import faTv from '@fortawesome/fontawesome-free-solid/faTv'
import faMusic from '@fortawesome/fontawesome-free-solid/faMusic'
import faCameraRetro from '@fortawesome/fontawesome-free-solid/faCameraRetro'
import faFileAlt from '@fortawesome/fontawesome-free-solid/faFileAlt'

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

  static defaultProps = {
    navItems: [
      {name: 'HOME', link: '/', icon: faHome},
      {name: 'NEWS', link: '/', icon: faNewspaper},
      {name: 'GUILD', link: '/login', icon: faUsers},
      {name: 'CONTESTS', link: '/login', icon: faGamepad},
      {name: 'MEDIA', link: '/login', icon: faFilm},
      {name: 'ARTICLES', link: '/login', icon: faFileAlt},
      {name: 'TEAM', link: '/login', icon: faIdCard},
      {name: 'PANTHEON: ROFF', link: '/login', icon: faExternalLinkAlt},
      {name: 'JOIN', link: '/login', icon: faSignInAlt},
      {name: 'Sign In/Up', link: '/login', icon: faUserCircle},
    ]
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

  renderNavItems = navItems => Object.keys(navItems).map(k => {
    return (
      <Link to={navItems[k].link} className="">
        <FontAwesomeIcon icon={navItems[k].icon} size="2x"/>
        <div className="center navLinkLabel">{navItems[k].name}</div>
      </Link>
    )
  })

  render() {
    const {navItems} = this.props
    return (
      <div className="NavBarContainer">
        {this.renderNavItems(navItems)}
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
