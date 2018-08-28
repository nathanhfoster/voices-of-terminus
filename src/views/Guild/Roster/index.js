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
      discordData: {},
      guildMembers: []
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
    'draeznor', 'MonsterKoala', 'Siggard', 'Krank',
    'Kazgoroth', 'Lyonheart', 'Rhovan'
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
    this.getGuildRoster("https://discordapp.com/api/guilds/161500442088439808/widget.json")
    //this.getGuildRoleRoster("https://discordapp.com/api/oauth2/guilds/351071354667139072/members")
    this.setState({
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

//   getGuildRoleRoster = (url) => {
//     let req = new XMLHttpRequest()
//     req.onreadystatechange = () => {
//         if (req.readyState == 4 && req.status == 200) {
//           console.log("getGuildRoleRoster: ", req.responseText)
//         }
//     }
//     req.open("GET", url, true)
//     req.setRequestHeader('Authorization', 'Bot ' + 'MzUxMTcwNTk3MzYxMDI1MDI2.DmdkcQ.HVSLJIl5dgcOT39KrTOsiI2_S9k')
//     req.send()
// }

  getGuildRoster = (url) => {
    let req = new XMLHttpRequest()
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
          const discordData = JSON.parse(req.responseText)
          const discordMembers = Object.keys(discordData.members).map(i => { 
            discordData.members[i].guildMember = false
            if(discordData.members[i].nick && discordData.members[i].nick.includes("VoT")) {
              discordData.members[i].guildMember = true
            }
            return discordData.members[i]
          })
          const guildMembers = discordMembers.filter(i => i.guildMember)
          this.setState({ discordData, guildMembers })
        }
    }
    req.open("GET", url, true)
    req.send()
}

  renderPeople = (color, routeItems) => routeItems.map(k => {
    return (
      <Col lg={3} md={3} sm={3} xs={4}>
        <p style={{color: color}}>{k}</p>
      </Col>
    )
  })

  renderGuildMembers = (color, members) => members.map(k => {
    return(
      <Col lg={3} md={3} sm={3} xs={4}>
        <p style={{color: color}}>{k.nick}</p>
      </Col>
    )
  })

  render() {
    console.log(this.state)
    const {Leaders, Council, Officers, Members} = this.props
    const {guildMembers} = this.state
    return (
      <div className="RosterContainer">
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