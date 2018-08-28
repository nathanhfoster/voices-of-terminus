import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col} from 'react-bootstrap'
import './styles.css'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Roster extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
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
    'draeznor', 'MonsterKoala', 'Siggard',
    'KrankKazgoroth', 'LyonheartRhovan'
    ]
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  getState = props => {
    this.setState({
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderPeople = routeItems => routeItems.map(k => {
    return (
      <p>{k}</p>
    )
  })

  render() {
    const {Leaders, Council, Officers, Members} = this.props
    return (
      <div className="RosterContainer">
        <Grid>
          <Row>
            <h2>Leader(s)</h2>
            <Col>
              {this.renderPeople(Leaders)}
            </Col>
          </Row>
          <Row>
            <h2>Council</h2>
            <Col>
             {this.renderPeople(Council)}
            </Col>
          </Row>
          <Row>
            <h2>Officers</h2>
            <Col>
              {this.renderPeople(Officers)}
            </Col>
          </Row>
          <Row>
            <h2>Members</h2>
            <Col>
            {this.renderPeople(Members)}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Roster)