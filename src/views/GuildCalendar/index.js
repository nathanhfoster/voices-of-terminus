import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import Calendar from 'react-calendar/dist/entry.nostyle'
import List from '../../components/List'
import {Grid, Row, Col, PageHeader} from 'react-bootstrap'
import Moment from 'react-moment'
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
      activeDate: Date,
      events: []
    }
  }

  static propTypes = { 
    activeDate: PropTypes.Date,
    events: PropTypes.array
  }

  static defaultProps = {
    activeDate: new Date(),
    monthToString: {"01": 'Jan', "02": 'Feb', "03": 'Mar', "04": 'Apr', "05": 'May', "06": 'Jun',
                    "07": 'Jul', "08": 'Aug', "09": 'Sep', "10": 'Oct', "11": 'Nov', "12": 'Dec'},
    events: [
      {key: 1, name: 'Event 1',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 2, name: 'Event 2',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 3, name: 'Event 3',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 4, name: 'Event 4',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 5, name: 'Event 5',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 6, name: 'Event 6',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 7, name: 'Event 7',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 8, name: 'Event 8',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 9, name: 'Event 9',   startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 10, name: 'Event 10', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 11, name: 'Event 11', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 12, name: 'Event 12', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 13, name: 'Event 13', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 14, name: 'Event 14', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 15, name: 'Event 15', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 16, name: 'Event 16', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 17, name: 'Event 17', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 18, name: 'Event 18', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 19, name: 'Event 19', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 20, name: 'Event 20', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 21, name: 'Event 21', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 22, name: 'Event 22', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 23, name: 'Event 23', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 24, name: 'Event 24', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 25, name: 'Event 25', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 26, name: 'Event 26', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 27, name: 'Event 27', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 28, name: 'Event 28', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 29, name: 'Event 29', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 30, name: 'Event 30', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 31, name: 'Event 31', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 32, name: 'Event 32', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 33, name: 'Event 33', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 34, name: 'Event 34', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 35, name: 'Event 35', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 36, name: 'Event 36', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 37, name: 'Event 37', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 38, name: 'Event 38', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 39, name: 'Event 39', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 40, name: 'Event 40', startTime: new Date(2018, 9, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
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
    const {activeDate, events} = props
    this.setState({
      activeDate,
      events
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  onChange = activeDate => this.setState({activeDate})

  formatDate = monthDay => {
    const split = monthDay.split("-")
    return this.props.monthToString[split[0]] + ' ' + split[1]
  }

  render() {
    const {events, activeDate} = this.state
    return (
      <Grid className="GuildCalendar Container">
        <Row>
          <PageHeader className="pageHeader">CALENDAR</PageHeader>
        </Row>
        <Row>
          <Col className="DatePicker" md={10}>
            <Calendar
            onChange={this.onChange}
            value={activeDate}
            activeStartDate={activeDate} // fallback if value not set
            />
          </Col>
          <Col className="EventList">
            <h2><Moment format="MM-D" filter={this.formatDate}>{activeDate}</Moment></h2>
            <List data={events}/>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(GuildCalendar)