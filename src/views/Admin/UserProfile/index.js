import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, PageHeader, NavItem} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import {withRouter, Redirect,} from 'react-router-dom'
import {getUser} from '../../../actions/Admin'
import Moment from 'react-moment'
import './styles.css'
import './stylesM.css'

const mapStateToProps = ({Admin, User}) => ({
  Admin,
  User
})

const mapDispatchToProps = {
  getUser
}

class UserProfile extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
    User: {
      experience_points: '',
      is_active: '',
      is_staff: '',
      is_superuser: '',
      primary_class: '',
      primary_role: '',
      secondary_class: '',
      secondary_role: '',
      profession: '',
      profession_specialization: '',


      username: '',
      bio: '',
      date_joined: '',
      discord_url: '',
      email: '',
      first_name: '',
      last_name: '',
      id: null,
      last_login: '',
      password: '',
      profile_image: null,
      discord_url: '',
      twitch_url: '',
      twitter_url: '',
      youtube_url: ''
    }
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const {id} = this.props.match.params
    this.props.getUser(id)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Admin, match} = props
    const {id} = match.params

    this.setState({Admin, match, id})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {Admin} = this.state
    const User = Admin.User ? Admin.User : this.props.User
    return (
      !this.props.User.isSuperUser ? <Redirect to={this.props.history.goBack()}/>
      :<Grid className="UserProfile Container">
        <Row>
          <PageHeader className="pageHeader">PROFILE</PageHeader>
        </Row>
        <Row>
          <h2>USER INFO</h2>
        </Row>
        <Row>
          <Col md={3}>
          <h3>Username: {User.username}</h3>
          </Col>
          <Col md={3}>
          <h3>Email: {User.email}</h3>
          </Col>
          <Col md={3}>
            <h3>First Name: {User.first_name}</h3>
          </Col>
          <Col md={3}>
            <h3>Last Name: {User.last_name}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3>Bio: {User.bio}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h3>Joined:  <Moment format="MMMM DD, YYYY">{User.date_joined}</Moment></h3>
          </Col>
          <Col md={6}>
            <h3>Last login: <Moment format="MMMM DD, YYYY">{User.last_login}</Moment></h3>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
          <h3>Experience: {User.experience_points} / 10000<progress value={User.experience_points} min="0" max="10000"></progress></h3>
          </Col>
          <Col md={3}>
            <h3>Is Super User: {User.is_superuser ? 'TRUE' : 'FALSE'}</h3>
          </Col>
          <Col md={3}>
            <h3>Is Staff: {User.is_staff ? 'TRUE' : 'FALSE'}</h3>
          </Col>
          <Col md={2}>
            <h3>Is active: {User.is_active ? 'TRUE' : 'FALSE'}</h3>
          </Col>
        </Row>
        <Row>
          <h2>ROLES & CLASSES</h2>
          <Col md={3}>
            <h3>Primary: {User.primary_role}</h3>
          </Col>
          <Col md={3}>
            <h3>Class: {User.primary_class}</h3>
          </Col>
          <Col md={3}>
            <h3>Secondary: {User.secondary_role}</h3>
          </Col>
          <Col md={3}>
            <h3>Class: {User.secondary_class}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h3>Profession: {User.profession}</h3>
          </Col>
          <Col md={6}>
            <h3>Specialization: {User.profession_specialization}</h3>
          </Col>
        </Row>
        <Row>
          <h2>CONNECTIONS</h2>
        </Row>
        <Row>
          <Col md={3}>
            <a href={User.discord_url} class="fab fa-discord fa-2x" target="_blank"></a>
          </Col>
          <Col md={3}>
           <a href={User.twitch_url} class="fab fa-twitch fa-2x" target="_blank"></a>
          </Col>
          <Col md={3}>
            <a href={User.twitter_url} class="fab fa-twitter fa-2x" target="_blank"></a>
          </Col>
          <Col md={3}>
            <a href={User.youtube_url} class="fab fa-youtube fa-2x" target="_blank"></a>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(UserProfile))