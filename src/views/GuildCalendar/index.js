import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import Calendar from 'react-calendar/dist/entry.nostyle'
import List from '../../components/List'
import {Grid, Row, Col, PageHeader} from 'react-bootstrap'
import Moment from 'react-moment'
import MomentJS from 'moment'
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
      {key: 1, name: 'Event 1',   startTime: new Date(2018, 8, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 2, name: 'Event 2',   startTime: new Date(2018, 8, 3, 10, 30), endTime: new Date(2018, 9, 3, 12, 30)},
      {key: 3, name: 'Event 3',   startTime: new Date(2018, 8, 4, 10, 30), endTime: new Date(2018, 9, 4, 12, 30)},
      {key: 4, name: 'Event 4',   startTime: new Date(2018, 8, 4, 10, 30), endTime: new Date(2018, 9, 4, 12, 30)},
      {key: 5, name: 'Event 5',   startTime: new Date(2018, 8, 24, 10, 30), endTime: new Date(2018, 9, 4, 12, 30)},
      {key: 6, name: 'Event 6',   startTime: new Date(2018, 8, 5, 10, 30), endTime: new Date(2018, 9, 4, 12, 30)},
      {key: 7, name: 'Event 7',   startTime: new Date(2018, 8, 5, 10, 30), endTime: new Date(2018, 9, 5, 12, 30)},
      {key: 8, name: 'Event 8',   startTime: new Date(2018, 8, 25, 10, 30), endTime: new Date(2018, 9, 5, 12, 30)},
      {key: 9, name: 'Event 9',   startTime: new Date(2018, 8, 25, 10, 30), endTime: new Date(2018, 9, 5, 12, 30)},
      {key: 10, name: 'Event 10', startTime: new Date(2018, 8, 25, 10, 30), endTime: new Date(2018, 9, 5, 12, 30)},
      {key: 11, name: 'Event 11', startTime: new Date(2018, 8, 25, 10, 30), endTime: new Date(2018, 9, 5, 12, 30)},
      {key: 12, name: 'Event 12', startTime: new Date(2018, 8, 25, 10, 30), endTime: new Date(2018, 9, 5, 12, 30)},
      {key: 13, name: 'Event 13', startTime: new Date(2018, 8, 25, 10, 30), endTime: new Date(2018, 9, 5, 12, 30)},
      {key: 14, name: 'Event 14', startTime: new Date(2018, 8, 25, 10, 30), endTime: new Date(2018, 9, 5, 12, 30)},
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

  hasEvents = ({ date, view }) => {
    const {events} = this.state
    return(
      <div class="TileContent">
        {events.map( k => {
        const calendarDay = MomentJS(date)
        const eventStartTime = MomentJS(k.startTime)
        const eventFound = eventStartTime.isSame(calendarDay, 'day')
        return view === 'month' && eventFound ? 
        <div className="hasEventsContainer">
          <span className="eventLabelColor" />
          <span className="eventStartTime"><Moment format="HH:mma">{k.startTime}</Moment></span>
          <h6 className="eventTitle">{k.name}</h6>
        </div>
        : null
      })}
    </div>
    )
}

  render() {
    const {events, activeDate} = this.state
    return (
      <Grid className="GuildCalendar Container">
        <Row>
          <PageHeader className="pageHeader">CALENDAR</PageHeader>
        </Row>
        <Row>
          <Col className="DatePicker" lg={12} md={12} sm={12}>
            <Calendar
            onChange={this.onChange}
            value={activeDate}
            activeStartDate={activeDate} // fallback if value not set
            tileContent={this.hasEvents}
            showFixedNumberOfWeeks={true}
            next2Label={null}
            prev2Label={null}
            nextLabel={<i class="fa fa-chevron-circle-right"/>}
            prevLabel={<i class="fa fa-chevron-circle-left"/>}
            />
          </Col>
          <Col className="EventList" lgHidden mdHidden sm={12}>
            <h2><Moment format="MM-D" filter={this.formatDate}>{activeDate}</Moment></h2>
            <List data={events} activeDate={activeDate}/>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(GuildCalendar)