import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import Calendar from 'react-calendar/dist/entry.nostyle'
import List from '../../components/List'
import {Grid, Row, Col, PageHeader} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class GuildCalendar extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      date: new Date(),
      events: []
    }
  }

  static propTypes = { 
    date: PropTypes.Date,
    events: PropTypes.array
  }

  static defaultProps = {
    date: new Date(),
    events: [
      {key: 1, name: 'Event 1'},
      {key: 2, name: 'Event 2'},
      {key: 3, name: 'Event 3'},
      {key: 4, name: 'Event 4'},
      {key: 5, name: 'Event 5'},
      {key: 6, name: 'Event 6'},
      {key: 7, name: 'Event 7'},
      {key: 8, name: 'Event 8'},
      {key: 9, name: 'Event 9'},
      {key: 10, name: 'Event 10'},
      {key: 11, name: 'Event 11'},
      {key: 12, name: 'Event 12'},
      {key: 13, name: 'Event 13'},
      {key: 14, name: 'Event 14'},
      {key: 15, name: 'Event 15'},
      {key: 16, name: 'Event 16'},
      {key: 17, name: 'Event 17'},
      {key: 18, name: 'Event 18'},
      {key: 19, name: 'Event 19'},
      {key: 20, name: 'Event 20'},
      {key: 21, name: 'Event 21'},
      {key: 22, name: 'Event 22'},
      {key: 23, name: 'Event 23'},
      {key: 24, name: 'Event 24'},
      {key: 25, name: 'Event 25'},
      {key: 26, name: 'Event 26'},
      {key: 27, name: 'Event 27'},
      {key: 28, name: 'Event 28'},
      {key: 29, name: 'Event 29'},
      {key: 30, name: 'Event 30'},
      {key: 31, name: 'Event 31'},
      {key: 32, name: 'Event 32'},
      {key: 33, name: 'Event 33'},
      {key: 34, name: 'Event 34'},
      {key: 35, name: 'Event 35'},
      {key: 36, name: 'Event 36'},
      {key: 37, name: 'Event 37'},
      {key: 38, name: 'Event 38'},
      {key: 39, name: 'Event 39'},
      {key: 40, name: 'Event 40'},
    ]
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {events} = props
    this.setState({
      events
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  onChange = date => this.setState({date})

  render() {
    const {events} = this.state
    return (
      <Grid className="GuildCalendar Container">
        <Row>
          <PageHeader className="pageHeader">CALENDAR</PageHeader>
        </Row>
        <Row>
          <Col className="DatePicker" md={10}>
            <Calendar
            onChange={this.onChange}
            value={this.state.date}
            activeStartDate={this.state.date} // fallback if value not set
            />
          </Col>
          <Col className="EventList">
            <h2>Events</h2>
            <List data={events}/>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(GuildCalendar)