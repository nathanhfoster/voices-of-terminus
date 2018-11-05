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
import ScrollTextBox from '../../components/ScrollTextBox'
import {getGuildMembers} from '../../actions/Guild'


const mapStateToProps = ({User}) => ({
  User
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
      eventKey: ''
    }
  }

  static propTypes = { 
    history: PropTypes.object,
    discordData: PropTypes.object,
    getGuildMembers: PropTypes.func.isRequired,
  }

  static defaultProps = {
    TabItems: [
      {eventKey : "/guild/about", Title: "ABOUT", Component: About},
      {eventKey : "/guild/roster", Title: "ROSTER", Component: Roster},
      {eventKey : "/guild/charters", Title: "CHARTERS", Component: Charters},
      {eventKey : "/guild/lore", Title: "LORE", Component: Lore},
      {eventKey : "/guild/contests", Title: "CONTESTS", Component: Contests},
      {eventKey : "/guild/team", Title: "TEAM", Component: Team},
      {eventKey : "/guild/join", Title: "JOIN", Component: Join}
    ]
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    //this.props.getGuildMembers()
    
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User, history} = props
    const {pathname} = history.location
    this.setState({User, eventKey: pathname, history})
  }

  renderTabs = TabItems => TabItems.map(k => {
    return (
      <Tab eventKey={k.eventKey} title={k.Title} className="fadeIn-2" unmountOnExit={true}>
        {<k.Component />}
      </Tab>
    )
  })
  
  render() {
    const {eventKey, history} = this.state
    const {TabItems} = this.props
    return (
      <Grid className="Guild Container fadeIn-2">
        <Row>
         <PageHeader className="pageHeader">GUILD</PageHeader>
        </Row>
        <Row>
          <Tabs defaultActiveKey={eventKey} activeKey={eventKey} className="Tabs" onSelect={eventKey => {this.setState({eventKey}); history.push(eventKey)}} animation={false}>
            {this.renderTabs(TabItems)}
          </Tabs>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Guild))