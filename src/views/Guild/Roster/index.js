import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutableProptypes from 'react-immutable-proptypes'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col} from 'react-bootstrap'
import './styles.css'
import {getGuildMembers} from '../../../actions'

const mapStateToProps = ({ guildMembers }) => ({
  guildMembers
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
    discordData: PropTypes.object,
    guildMembers: PropTypes.array,
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
    this.getState(this.props)
  }

  componentDidMount() {
    this.props.getGuildMembers()
  }

  componentWillReceiveProps(nextProps) {
  }

  getState = props => {  
    const {guildMembers} = props
    this.setState({
      guildMembers
      })
  }

  componentWillUpdate() {
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
      <div className="Roster Container">
        <Grid>
          <Row>
            <h3>Leader(s)</h3>
            {this.renderPeople('#ba0bfb', Leaders)}
          </Row>
          <Row>
            <h3>Council</h3>
            {this.renderPeople('var(--primaryColor)', Council)}
          </Row>
          <Row>
            <h3>Officers</h3>
            {this.renderPeople('#f00', Officers)}
          </Row>
          <Row>
            <h3>Members</h3>
            {this.renderGuildMembers('#0f0', guildMembers)}
          </Row>
        </Grid>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Roster)