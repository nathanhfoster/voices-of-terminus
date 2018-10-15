import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, PageHeader} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import {withRouter, Redirect} from 'react-router-dom'
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
          <h2>EDITABLE</h2>
        </Row>
        <Row>
          <Col md={12}>
          </Col>
        </Row>
        <Row>
          <h2>USER INFO</h2>
        </Row>
        <Row>
          <Col md={3}>
            Username: {User.username}
          </Col>
          <Col md={3}>
            Email: {User.email}
          </Col>
          <Col md={3}>
            First Name: {User.first_name}
          </Col>
          <Col md={3}>
            Last Name: {User.last_name}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            Bio: {User.bio}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            Joined:  <Moment format="MMMM DD, YYYY">{User.date_joined}</Moment>
          </Col>
          <Col md={6}>
            Last login: <Moment format="MMMM DD, YYYY">{User.last_login}</Moment>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            Experience: {User.experience_points}
          </Col>
          <Col md={3}>
            Is Super User: {User.is_superuser ? 'TRUE' : 'FALSE'}
          </Col>
          <Col md={3}>
            Is Staff: {User.is_staff ? 'TRUE' : 'FALSE'}
          </Col>
          <Col md={3}>
            Is active: {User.is_active ? 'TRUE' : 'FALSE'}
          </Col>
        </Row>
        <Row>
          <h2>ROLES & CLASSES</h2>
          <Col md={3}>
            Primary: {User.primary_role}
          </Col>
          <Col md={3}>
            Class: {User.primary_class}
          </Col>
          <Col md={3}>
            Secondary: {User.secondary_role}
          </Col>
          <Col md={3}>
            Class: {User.secondary_class}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            Profession: {User.profession}
          </Col>
          <Col md={6}>
            Specialization: {User.profession_specialization}
          </Col>
        </Row>
        <Row>
          <h2>CONNECTIONS</h2>
        </Row>
        <Row>
          <Col md={3}>
            Discord: {User.discord_url}
          </Col>
          <Col md={3}>
            Twitch: {User.twitch_url}
          </Col>
          <Col md={3}>
            Twitter: {User.twitch_url}
          </Col>
          <Col md={3}>
            YouTube: {User.youtube_url}
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(UserProfile))