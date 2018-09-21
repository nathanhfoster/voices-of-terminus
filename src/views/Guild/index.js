import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import './styles.css'
import {Grid, Row, Tabs, Tab, PageHeader} from 'react-bootstrap'

import About from './About'
import Roster from './Roster'
import Charters from './Charters'
import Lore from './Lore'
import Contests from './Contests'
import Team from './Team'
import Join from './Join'
import { Map, List } from 'immutable'
import ScrollTextBox from '../../components/ScrollTextBox'
import {getGuildMembers} from '../../actions/Guild'

const mapStateToProps = ({DiscordData}) => ({
  DiscordData
})

const mapDispatchToProps = {
  getGuildMembers
}

class Guild extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      history: {},
      discordData: {},
      guildMembers: []
    }
  }

  static propTypes = { 
    history: new Map(),
    getGuildMembers: PropTypes.func.isRequired,
    discordData: new Map(),
    guildMembers: new List(),
  }

  static defaultProps = {
    TabItems: [
      {Route: "/guild/about", Title: "ABOUT", Component: About},
      {Route: "/guild/roster", Title: "ROSTER", Component: Roster},
      {Route: "/guild/charters", Title: "CHARTERS", Component: Charters},
      {Route: "/guild/lore", Title: "LORE", Component: Lore},
      {Route: "/guild/contests", Title: "CONTESTS", Component: Contests},
      {Route: "/guild/team", Title: "TEAM", Component: Team},
      {Route: "/guild/join", Title: "JOIN", Component: Join}
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
    const guildMembers = props.DiscordData.members
    const {history} = props
    this.setState({
      history,
      guildMembers
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderTabs = TabItems => TabItems.map(k => {
    return (
      <Tab eventKey={k.Route} title={k.Title} className="fadeIn-2">
        {<k.Component />}
      </Tab>
    )
  })
  
  render() {
    const {history, guildMembers} = this.state
    const {TabItems} = this.props
    return (
      <Grid className="Guild Container">
        <Row>
         <PageHeader className="pageHeader">GUILD</PageHeader>
        </Row>
        <Row>
          <Tabs defaultActiveKey={history.location.pathname} className="Tabs" onSelect={Route => history.push(Route)} animation={false}>
            {guildMembers.length ? this.renderTabs(TabItems) : null}
          </Tabs>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Guild))