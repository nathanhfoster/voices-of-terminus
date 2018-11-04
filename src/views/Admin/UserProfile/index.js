import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, PageHeader, Image, Button, Checkbox} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import {withRouter, Redirect,} from 'react-router-dom'
import {getUser, clearUser, updateUserProfile} from '../../../actions/Admin'
import Select from 'react-select'
import Moment from 'react-moment'
import './styles.css'
import './stylesM.css'
import {selectStyles} from '../../../helpers/styles'

const mapStateToProps = ({Admin, User}) => ({
  Admin,
  User
})

const mapDispatchToProps = {
  getUser,
  clearUser,
  updateUserProfile
}

class UserProfile extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      Admin: {User: null}
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
    },

    permissionOptions: [
      { value: true, label: 'true' },
      { value: false, label: 'false' }
    ]
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
    const {Admin} = this.state.Admin.User && this.state.Admin.User.hasOwnProperty('id') ? this.state : props
    const {id} = props.match.params

    this.setState({Admin, id})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    this.props.clearUser()
  }
  
  onChange = e => this.setState({[e.target.name]: e.target.value})

  updateUserProfile = () => {
    const {id, is_superuser, is_staff, is_active, is_leader, is_council, is_officer, is_senior_member, is_junior_member, is_recruit,
      is_raid_leader, is_banker, is_recruiter, is_class_lead, is_crafter_lead,
      can_create_article, can_create_newsletter, can_create_calendar_event,
      can_read_article, can_read_newsletter, can_read_calendar_event,
      can_update_article, can_update_newsletter, can_update_calendar_event,
      can_delete_article, can_delete_newsletter, can_delete_calendar_event
    } = this.state.Admin.User
      
    const payload = {is_superuser, is_staff, is_active, is_leader, is_council, is_officer, is_senior_member, is_junior_member, is_recruit,
      is_raid_leader, is_banker, is_recruiter, is_class_lead, is_crafter_lead,
      can_create_article, can_create_newsletter, can_create_calendar_event,
      can_read_article, can_read_newsletter, can_read_calendar_event,
      can_update_article, can_update_newsletter, can_update_calendar_event,
      can_delete_article, can_delete_newsletter, can_delete_calendar_event
    }
    this.props.updateUserProfile(id, payload)
  }

  render() {
    const {Admin} = this.state
    const {User} = Admin
    const {permissionOptions} = this.props
    return (
      !this.props.User.is_superuser ? <Redirect to={this.props.history.goBack()}/>
      : User ?
      <Grid className="UserProfile Container">
        <Row>
          <PageHeader className="pageHeader">PROFILE</PageHeader>
        </Row>
        <Row>
          <h2 className="headerBanner">USER INFO</h2>
        </Row>
        <Row style={{border: '1px solid var(--grey_out)'}}>
          <Col md={4}><Image src={User.profile_image} style={{maxHeight: '250px'}} responsive rounded/></Col>
          <Col md={4} xs={12}>
            <h3>Joined: <Moment format="MMMM DD, YYYY">{User.date_joined}</Moment></h3>
          </Col>
          <Col md={4} xs={12}>
            <h3>Last login: <Moment format="MMMM DD, YYYY">{User.last_login}</Moment></h3>
          </Col>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}><h2><progress value={User.experience_points} min="0" max="10000"></progress></h2></Col>
        </Row>
        <Row className="checkBoxTable">
          <Col md={3} xs={6}>
          <h3>Username: {User.username}</h3>
          </Col>
          <Col md={3} xs={6}>
          <h3>Email: {User.email}</h3>
          </Col>
          <Col md={3} xs={6}>
            <h3>First Name: {User.first_name}</h3>
          </Col>
          <Col md={3} xs={6}>
            <h3>Last Name: {User.last_name}</h3>
          </Col>
          <Col md={12} xs={12}>
            <h3>Bio: {User.bio}</h3>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">STATUS</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col md={4} xs={12}>
            <Checkbox checked={User.is_active} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_active: !User.is_active}} }))}>
            <span className="checkBoxText">Active</span>
            <span className="help">Unselect this instead of deleting accounts.</span>
            </Checkbox>
          </Col>
          <Col md={4} xs={6}>
            <Checkbox checked={User.is_superuser} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_superuser: !User.is_superuser}} }))}>
            <span className="checkBoxText">Admin</span>
            <span className="help">Designates that this user has all permissions without explicitly assigning them.</span>
            </Checkbox>
          </Col>
          <Col md={4} xs={6}>
            <Checkbox checked={User.is_staff} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_staff: !User.is_staff}} }))}>
            <span className="checkBoxText">Staff</span>
            <span className="help">Designates whether the user can log into Django backend admin site.</span>
            </Checkbox>
          </Col>
        </Row>
        <Row className="checkBoxTable">
          <Col md={3} xs={6}>
            <Checkbox checked={User.is_leader} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_leader: !User.is_leader}} }))}>
            <span className="checkBoxText">Leader</span>
            <span className="help">Will show up as a leader in guild roster.</span>
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <Checkbox checked={User.is_council} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_council: !User.is_council}} }))}>
            <span className="checkBoxText">Council</span>
            <span className="help">Will show up on the Council in the guild roster.</span>
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <Checkbox checked={User.is_officer} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_officer: !User.is_officer}} }))}>
            <span className="checkBoxText">Officer</span>
            <span className="help">Will show up as an Officer in the guild roster.</span>
            </Checkbox>
          </Col>
          <Col md={4} xs={6}>
            <Checkbox checked={User.is_senior_member} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_senior_member: !User.is_senior_member}} }))}>
            <span className="checkBoxText">Senior Member</span>
            <span className="help">Will show up as a Member in the guild roster.</span>
            </Checkbox>
          </Col>
          <Col md={4} xs={6}>
            <Checkbox checked={User.is_junior_member} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_junior_member: !User.is_junior_member}} }))}>
            <span className="checkBoxText">Junior Member</span>
            <span className="help">Will show up as a Member in the guild roster.</span>
            </Checkbox>
          </Col>
          <Col md={4} xs={6}>
            <Checkbox checked={User.is_recruit} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_recruit: !User.is_recruit}} }))}>
            <span className="checkBoxText">Recruit</span>
            <span className="help">Will show up as a Member in the guild roster.</span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">PERMISSIONS</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col md={3} xs={6}>
            <h3>CREATE</h3>
            <span className="help">Can create designated content.</span>
            <Checkbox checked={User.can_create_article} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_create_article: !User.can_create_article}} }))}>
            Articles
            </Checkbox>
            <Checkbox checked={User.can_create_newsletter} onChange={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_create_newsletter: !User.can_create_newsletter}} }))}>
            Newsletters
            </Checkbox>
            <Checkbox checked={User.can_create_calendar_event} onChange={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_create_calendar_event: !User.can_create_calendar_event}} }))}>
            Calendar Events
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <h3>READ</h3>
            <span className="help">Can read designated content.</span>
            <Checkbox checked={User.can_read_article} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_read_article: !User.can_read_article}} }))}>
            Articles
            </Checkbox>
            <Checkbox checked={User.can_read_newsletter} onChange={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_read_newsletter: !User.can_read_newsletter}} }))}>
            Newsletters
            </Checkbox>
            <Checkbox checked={User.can_read_calendar_event} onChange={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_read_calendar_event: !User.can_read_calendar_event}} }))}>
            Calendar Events
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <h3>UPDATE</h3>
            <span className="help">Can update ANY designated content.</span>
            <Checkbox checked={User.can_update_article} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_update_article: !User.can_update_article}} }))}>
            Articles
            </Checkbox>
            <Checkbox checked={User.can_update_newsletter} onChange={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_update_newsletter: !User.can_update_newsletter}} }))}>
            Newsletters
            </Checkbox>
            <Checkbox checked={User.can_update_calendar_event} onChange={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_update_calendar_event: !User.can_update_calendar_event}} }))}>
            Calendar Events
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <h3>DELETE</h3>
            <span className="help">Can delete ANY designated content.</span>
            <Checkbox checked={User.can_delete_article} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_delete_article: !User.can_delete_article}} }))}>
            Articles
            </Checkbox>
            <Checkbox checked={User.can_delete_newsletter} onChange={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_delete_newsletter: !User.can_delete_newsletter}} }))}>
            Newsletters
            </Checkbox>
            <Checkbox checked={User.can_delete_calendar_event} onChange={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, can_delete_calendar_event: !User.can_delete_calendar_event}} }))}>
            Calendar Events
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">ROLES</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col md={3} xs={12}>
            <Checkbox checked={User.is_raid_leader} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_raid_leader: !User.is_raid_leader}} }))}>
            <span className="checkBoxText">Raid Leader</span>
            <span className="help">Raid Leader</span>
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <Checkbox checked={User.is_banker} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_banker: !User.is_banker}} }))}>
            <span className="checkBoxText">Banker</span>
            <span className="help">Banker</span>
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <Checkbox checked={User.is_recruiter} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_recruiter: !User.is_recruiter}} }))}>
            <span className="checkBoxText">Recruiter</span>
            <span className="help">Recruiter</span>
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <Checkbox checked={User.is_class_lead} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_class_lead: !User.is_class_lead}} }))}>
            <span className="checkBoxText">Class Lead</span>
            <span className="help">Class Lead</span>
            </Checkbox>
          </Col>
          <Col md={3} xs={6}>
            <Checkbox checked={User.is_crafter_lead} onClick={(e) => this.setState(prevState  => ({Admin: {...prevState.Admin, User: {...prevState.Admin.User, is_crafter_lead: !User.is_crafter_lead}} }))}>
            <span className="checkBoxText">Crafter Lead</span>
            <span className="help">Crafter Lead</span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">IN GAME</h2>
        </Row>
        <Row>
          <h3>Primary</h3>
        </Row>
        <Row className="checkBoxTable">
          <Col md={6} xs={6}>
            <h3>Role: {User.primary_role}</h3>
          </Col>
          <Col md={6} xs={6}>
            <h3>Class: {User.primary_class}</h3>
          </Col>
          <Col md={6} xs={6}>
            <h3>Profession: {User.profession}</h3>
          </Col>
          <Col md={6} xs={6}>
            <h3>Specialization: {User.profession_specialization}</h3>
          </Col>
        </Row>
        <Row>
          <h3>Secondary</h3>
        </Row>
        <Row className="checkBoxTable">
          <Col md={6} xs={6}>
            <h3>Role: {User.secondary_role}</h3>
          </Col>
          <Col md={6} xs={6}>
            <h3>Class: {User.secondary_class}</h3>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">CONNECTIONS</h2>
        </Row>
        <Row style={{marginTop: '16px'}}>
          <Col md={3} xs={3}>
            <a href={User.discord_url} class="fab fa-discord fa-2x" target="_blank"></a>
          </Col>
          <Col md={3} xs={3}>
           <a href={User.twitch_url} class="fab fa-twitch fa-2x" target="_blank"></a>
          </Col>
          <Col md={3} xs={3}>
            <a href={User.twitter_url} class="fab fa-twitter fa-2x" target="_blank"></a>
          </Col>
          <Col md={3} xs={3}>
            <a href={User.youtube_url} class="fab fa-youtube fa-2x" target="_blank"></a>
          </Col>
        </Row>
        <Row>
          <Col style={{textAlign: 'center', margin: '20px'}}>
            <Button onClick={this.updateUserProfile}>Update</Button>
          </Col>
        </Row>
      </Grid>
      : null
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(UserProfile))
