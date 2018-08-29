import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import {Tabs, Tab} from 'react-bootstrap'
import Charters from './Charters'
import Lore from './Lore'
import Roster from './Roster'
import {setGuildMembers} from '../../actions'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
  setGuildMembers
}

class Guild extends Component {
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

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  getState = props => {
    this.fetchGuildRoster("https://discordapp.com/api/guilds/161500442088439808/widget.json")
    this.setState({
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  fetchGuildRoster = (url) => {
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
          this.props.setGuildMembers(guildMembers)
          this.setState({ discordData, guildMembers })
        }
    }
    req.open("GET", url, true)
    req.send()
}

  render() {
    return (
      <div className="GuildContainer">
        <Tabs defaultActiveKey={1} className="Tabs">
          <Tab eventKey={1} title="ROSTER">
            <Roster />
          </Tab>

          <Tab eventKey={2} title="CHARTERS">
            <Charters />
          </Tab>

          <Tab eventKey={3} title="LORE">
            <Lore />
          </Tab>
          
        </Tabs>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Guild)