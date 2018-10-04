import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Map, List} from 'immutable'
import {Grid, Row, Col} from 'react-bootstrap'
import './styles.css'
import EventList from '../../../components/EventList'
import {getGuildMembers} from '../../../actions/Guild'

const mapStateToProps = ({ DiscordData }) => ({
  DiscordData
})

const mapDispatchToProps = {
  getGuildMembers
}

class Roster extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      discordData: {},
      guildMembers: []
    }
  }

  static propTypes = {
    discordData: new Map(),
    guildMembers: new List(),
    getGuildMembers: PropTypes.func.isRequired,
  }

  static defaultProps = {
    Leaders: ['Yarnila'],
    Council: ['Leksur', 'Kodiack'],
    Officers: ['Scribble', 'Nomad', 'Jorconn', 'Shaiana', 'Joshue'],
    Members: [
    'Youmu Svartie', 'Zathris', 'Rezum', 'Glenndyn',
    'Nailuj', 'DarkSoulOmega', 'SelarnDiloxz', 'Ancalime',
    'RoyalLeoWolf', 'Alic', 'Diemond', 'Brainbean',
    'Genocidal', 'Dhul Qarnayn', 'coach', 'Syntro',
    'Mortanos', 'Eanaden', 'Zolzimar', 'Backin',
    'Stormbow','Derek', 'Rousie', 'Damarack', 
    'Iaediil', 'Badger', 'Rumor Hasit', 'Mentor',
    'Rurian', 'Jie', 'Malidos', 'Pyratt',
    'Sitoryp', 'Dots', 'Kyrais', 'Banin',
    'Sydor', 'Adira', 'Broonsbane', 'Osiris Benderly',
    'Bailrock', 'Karnix', 'Sheidar', 'Halifax',
    'Raziel', 'Kadrio', 'CreepySneed', 'Sinisster',
    'draeznor', 'MonsterKoala', 'Siggard', 'Krank',
    'Kazgoroth', 'Lyonheart', 'Rhovan'
    ]
  }
  
  componentWillMount() {
    this.props.getGuildMembers()
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  componentWillUpdate() {
  }

  /* render() */

  componentDidMount() {

  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const guildMembers = this.props.DiscordData.members
    this.setState({
      guildMembers
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderPeople = (color, routeItems) => routeItems.map(k => {
    return (
      <Col lg={3} md={3} sm={3} xs={12}>
        <p style={{color: color}}>{k}</p>
      </Col>
    )
  })

  renderGuildMembers = (color, members) => members.map(k => {
    return(
      <Col lg={3} md={3} sm={3} xs={12}>
        <p style={{color: color}}>{k.nick}</p>
      </Col>
    )
  })

  render() {
    const {Leaders, Council, Officers} = this.props
    const {guildMembers} = this.state
    return (
      <div className="Roster">
        <Grid>
          <Row>
            <h3>Leader(s)</h3>
            {this.renderPeople('#ba0bfb', Leaders)}
          </Row>
          <Row>
            <h3>Council</h3>
            {this.renderPeople('#ff9800', Council)}
          </Row>
          <Row>
            <h3>Officers</h3>
            {this.renderPeople('#f00', Officers)}
          </Row>
          <Row>
            <h3>Members</h3>
            {guildMembers != null ? this.renderGuildMembers('#0f0', guildMembers) : null}
          </Row>
        </Grid>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Roster)