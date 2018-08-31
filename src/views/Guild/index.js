import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import './styles.css'
import {Grid, Tabs, Tab, PageHeader} from 'react-bootstrap'

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
    history: PropTypes.object
  }

  static defaultProps = {
    TabItems: [
      {Key: "/guild/roster", Title: "ROSTER", Component: Roster},
      {Key: "/guild/charters", Title: "CHARTERS", Component: Charters},
      {Key: "/guild/lore", Title: "LORE", Component: Lore},
      {Key: "/guild/contests", Title: "CONTESTS", Component: Contests},
      {Key: "/guild/team", Title: "TEAM", Component: Team},
      {Key: "/guild/join", Title: "JOIN", Component: Join}
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
      <Tab eventKey={k.Key} title={k.Title}>
        {<k.Component />}
      </Tab>
    )
  })
  render() {
    const {history} = this.state
    const {TabItems} = this.props
    console.log(history.location.pathname)
    return (
      <Grid className="Guild Container">
        <PageHeader className="pageHeader">GUILD</PageHeader>
        <Tabs defaultActiveKey={history.location.pathname} className="Tabs" animation onSelect={(key) => history.push(key)}>
          {this.renderTabs(TabItems)}
        </Tabs>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Guild))