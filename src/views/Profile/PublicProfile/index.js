import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Well, Image} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'
import {getUser} from '../../../actions/App'
import {withRouter} from 'react-router-dom'
import {statusLevelInt, statusLevelString, classIcon, professionIcon} from '../../../helpers'
import Moment from 'react-moment'
import {ExperienceBar} from '../../../components/ExperienceBar'

const mapStateToProps = ({Admin}) => ({
  Admin
})

const mapDispatchToProps = {
  getUser
}

class PublicProfile extends Component {
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

  componentWillUpdate() {
  }

  componentDidMount() {
    const {id} = this.props.match.params
    this.props.getUser(id)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User} = props.Admin
    this.setState({User})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderRoles = roles => Object.keys(roles).map(k => {
    if(roles[k]) {
      if(k === 'is_raid_leader') return [<span>Raid Leader</span>, <span>|</span>]
      if(k === 'is_banker') return [<span>Banker</span>, <span>|</span>]
      if(k === 'is_recruiter') return [<span>Recruiter</span>, <span>|</span>]
      if(k === 'is_class_lead') return [<span>Class Lead</span>, <span>|</span>]
      if(k === 'is_crafter_lead') return [<span>Crafter Lead</span>, <span>|</span>]
    }
    return null
  })

  renderDividedText = text => text.map((txt, i) => txt ?  txt + " | " : i === 0 ? <i className="fas fa-ban"/> : null)

  render() {
    const {User} = this.state
    const {is_leader, is_council, is_general_officer, is_officer, is_senior_member, is_junior_member, is_recruit,
    is_raid_leader, is_banker, is_recruiter, is_class_lead, is_crafter_lead} = User ? User : {}
    const UserStatus = {is_leader, is_council, is_general_officer, is_officer, is_senior_member, is_junior_member, is_recruit}
    const UserRoles = {is_raid_leader, is_banker, is_recruiter, is_class_lead, is_crafter_lead}
    return (
      User ? 
      <Grid className="PublicProfile Container fadeIn-2">
        <Row className="Center">
          <Col md={4} xs={12} className="Center"><Image title="Profile Image" src={User.profile_image} className="ProfileImages" responsive rounded/></Col>
          <Col md={5} xs={12}>
            <h1 title="User Name">{User.username.toUpperCase()}</h1>
            <span title="First and Last Name" className="help">{User.first_name} {User.last_name}</span>
            <h2 title="Status">{statusLevelString(statusLevelInt(UserStatus))}</h2>
            <div title="Roles" className="userRoles help"><span> |</span>{this.renderRoles(UserRoles)}</div>
            <h4 title="Primary Class Icon"><Image src={classIcon(User.primary_class)} style={{height: '24px'}}/>
            <strong title="Primary | Race | Role | Class |"> Primary</strong><span> | </span>{this.renderDividedText([User.primary_race, User.primary_role, User.primary_class])}</h4>
            <h4 title="Seconday Class Icon"><Image src={classIcon(User.secondary_class)} style={{height: '26px'}}/>
            <strong title="Secondary | Race | Role | Class |"> Secondary</strong><span> | </span>{this.renderDividedText([User.secondary_race, User.secondary_role, User.secondary_class])}</h4>
            <h4 title="Profession | Profession | Profession Specialization | ">{professionIcon(User.profession, User.profession_specialization)}<strong> Profession</strong><span> | </span>{this.renderDividedText([User.profession, User.profession_specialization])}</h4>
          </Col>
          <Col md={3} xs={12} className="Center">
            <h3 title="Date Joined"><i className="fas fa-birthday-cake"/> <Moment format="MMM DD, YYYY">{User.date_joined}</Moment></h3>
            <h3 title="Last Login"><i className="fas fa-sign-in-alt"/> <Moment fromNow>{User.last_login}</Moment></h3>
            <h3 title="Guild Points"><i className="fas fa-coins"/> {User.guild_points}</h3>
          </Col>
        </Row>
        <Row className="Center">
          <Col xs={12}>{ExperienceBar(User.experience_points)}</Col>
          <Col xs={12}><Well className="userBio" bsSize="large">{User.bio ? User.bio : 'No biography given.'}</Well></Col>
          <Col xs={12}>
            <h3>Achievements</h3>
            <Well className="userBio" bsSize="large">
              <i className="fas fa-award"></i> 
              <i className="fas fa-certificate"></i>
              <i className="fas fa-trophy"></i>
              <i className="fas fa-star"></i>
              <i className="fab fa-optin-monster"></i>
              <i className="fas fa-vihara"></i>
              <i className="fas fa-pastafarianism"></i>
              <i className="fas fa-shield-alt"></i>
              <i className="fas fa-user-shield"></i>
              <i className="fas fa-bolt"></i>
              <i className="fas fa-ban"></i>
              <i className="fas fa-binoculars"></i>
              <i className="fas fa-bell"></i>
              <i className="fas fa-book-dead"/>
              <i className="fas fa-book"></i>
              <i className="fas fa-brain"></i>
              <i className="fas fa-calendar-alt"></i>
              <i className="fas fa-chalkboard-teacher"></i>
              <i className="fas fa-edit"></i>
              <i className="fas fa-dumbbell"></i>
              <i className="fas fa-dungeon"></i>
              <i className="fas fa-fist-raised"></i>
              <i className="fab fa-fort-awesome"></i>
              <i className="fas fa-gamepad"></i>
              <i className="fab fa-galactic-senate"></i>
              <i className="fab fa-galactic-republic"></i>
              <i className="fas fa-gavel"></i>
              <i className="fas fa-gem"></i>
              <i className="fas fa-gopuram"></i>
              <i className="fas fa-graduation-cap"></i>
              <i className="fas fa-hammer"></i>
              <i className="fas fa-hands"></i>
              <i className="fas fa-hands-helping"></i>
              <i className="fas fa-hat-wizard"></i>
              <i className="fab fa-hotjar"></i>
              <i className="fas fa-jedi"></i>
              <i className="fab fa-jedi-order"></i>
              <i className="fab fa-joget"></i>
              <i className="fab fa-joomla"></i>
              <i className="fas fa-journal-whills"></i>
              <i className="fab fa-keycdn"></i>
              <i className="fas fa-khanda"></i>
              <i className="fab fa-mandalorian"></i>
              <i className="fas fa-microphone-alt"></i>
              <i className="far fa-newspaper"></i>
              <i className="fab fa-old-republic"></i>
              <i className="fab fa-phoenix-framework"></i>
              <i className="fas fa-poop"></i>
              <i className="fas fa-podcast"></i>
              <i className="fab fa-rebel"></i>
              <i className="fab fa-readme"></i>
              <i className="fas fa-ring"></i>
              <i className="fas fa-scroll"></i>
              <i className="fas fa-sign-in-alt"></i>
              <i className="fas fa-store"></i>
              <i className="fab fa-studiovinari"></i>
              <i className="fab fa-wolf-pack-battalion"></i>
            </Well>
          </Col>
        </Row>
        <Row className="userConnections">
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
      </Grid> : null 
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(PublicProfile))
