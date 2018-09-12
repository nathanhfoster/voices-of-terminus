import React, { Component } from 'react'
import ImmutableProptypes from 'react-immutable-proptypes'
import { connect as reduxConnect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import './styles.css'
import {Grid, Row, Tabs, Tab, PageHeader} from 'react-bootstrap'

import Roster from './Roster'
import Charters from './Charters'
import Lore from './Lore'
import Contests from './Contests'
import Team from './Team'
import Join from './Join'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
  
}

class Guild extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      history: {}
    }
  }

  static propTypes = { 
    history: ImmutableProptypes.map
  }

  static defaultProps = {
    TabItems: [
      {Route: "/guild/roster", Title: "ROSTER", Component: Roster},
      {Route: "/guild/charters", Title: "CHARTERS", Component: Charters},
      {Route: "/guild/lore", Title: "LORE", Component: Lore},
      {Route: "/guild/contests", Title: "CONTESTS", Component: Contests},
      {Route: "/guild/team", Title: "TEAM", Component: Team},
      {Route: "/guild/join", Title: "JOIN", Component: Join}
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
    const {history} = props
    this.setState({
      history
      })
  }

  componentWillUpdate() {
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
    const {history} = this.state
    const {TabItems} = this.props
    return (
      <Grid className="Guild Container">
        <Row>
         <PageHeader className="pageHeader">GUILD</PageHeader>
        </Row>
        <Row>
          <Tabs defaultActiveKey={history.location.pathname} className="Tabs" onSelect={(Route) => history.push(Route)}>
            {this.renderTabs(TabItems)}
          </Tabs>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Guild))