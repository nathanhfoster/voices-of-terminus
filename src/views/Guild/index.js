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

  render() {
    const {history} = this.state
    console.log(history.location.pathname)
    return (
      <Grid className="Guild Container">
        <PageHeader className="pageHeader">GUILD</PageHeader>
        <Tabs defaultActiveKey={history.location.pathname} className="Tabs" animation onSelect={(key) => history.push(key)}>
          <Tab eventKey={'/guild/roster'} title="ROSTER">
            <Roster />
          </Tab>

          <Tab eventKey={'/guild/charters'} title="CHARTERS">
            <Charters />
          </Tab>

          <Tab eventKey={'/guild/lore'} title="LORE">
            <Lore />
          </Tab>

          <Tab eventKey={'/guild/contests'} title="CONTESTS">
            <Contests />
          </Tab>

          <Tab eventKey={'/guild/team'} title="TEAM">
            <Team />
          </Tab>

          <Tab eventKey={'/guild/join'} title="JOIN">
            <Join />
          </Tab>

        </Tabs>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Guild))