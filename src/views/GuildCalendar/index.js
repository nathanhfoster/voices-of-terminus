import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import Calendar from "react-calendar/dist/entry.nostyle";
import EventList from "../../components/EventList";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  ButtonToolbar,
  Button,
  InputGroup,
  Modal
} from "react-bootstrap";
import Moment from "react-moment";
import MomentJS from "moment";
import "./styles.css";
import "./stylesM.css";

const mapStateToProps = ({ User, Window }) => ({
  User,
  Window
});

const mapDispatchToProps = {};

class GuildCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: null,
      events: PropTypes.array,
      isMobile: false,
      show: false,
      editing: false
    };
  }

  static propTypes = {
    activeDate: PropTypes.Date,
    events: PropTypes.array,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    activeDate: new Date(),
    events: [
      {
        key: 1,
        name: "Event 1",
        startTime: new Date(2018, 11, 3, 10, 30),
        endTime: new Date(2018, 11, 3, 12, 30)
      },
      {
        key: 2,
        name: "Event 2",
        startTime: new Date(2018, 11, 3, 10, 30),
        endTime: new Date(2018, 11, 3, 12, 30)
      },
      {
        key: 3,
        name: "Event 3",
        startTime: new Date(2018, 11, 4, 10, 30),
        endTime: new Date(2018, 11, 4, 12, 30)
      },
      {
        key: 4,
        name: "Event 4",
        startTime: new Date(2018, 11, 4, 10, 30),
        endTime: new Date(2018, 11, 4, 12, 30)
      },
      {
        key: 5,
        name: "Event 5",
        startTime: new Date(2018, 11, 24, 10, 30),
        endTime: new Date(2018, 11, 4, 12, 30)
      },
      {
        key: 6,
        name: "Event 6",
        startTime: new Date(2018, 11, 5, 10, 30),
        endTime: new Date(2018, 11, 4, 12, 30)
      },
      {
        key: 7,
        name: "Event 7",
        startTime: new Date(2018, 11, 5, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 8,
        name: "Event 8",
        startTime: new Date(2018, 11, 25, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 9,
        name: "Event 9",
        startTime: new Date(2018, 11, 25, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 10,
        name: "Event 10",
        startTime: new Date(2018, 11, 25, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 11,
        name: "Event 11",
        startTime: new Date(2018, 11, 25, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 12,
        name: "Event 12",
        startTime: new Date(2018, 11, 25, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 13,
        name: "Event 13",
        startTime: new Date(2018, 11, 25, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 14,
        name: "Event 14",
        startTime: new Date(2018, 11, 25, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 15,
        name: "Event 14",
        startTime: new Date(2018, 8, 25, 10, 30),
        endTime: new Date(2018, 11, 5, 12, 30)
      }
    ]
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, events, Window } = props;
    const { activeDate } = this.state.activeDate ? this.state : props;
    this.setState({ User, activeDate, events, Window });
  };

  onChange = activeDate => this.setState({ activeDate });

  hasEvents = ({ date, view }) => {
    const { events } = this.state;
    const { isMobile } = this.state.Window;
    let mapCounter = {}; // Use to display only 1 eventLabelColor per day for mobile
    return (
      <div class="TileContent">
        {events.map(k => {
          const calendarDay = MomentJS(date);
          const eventStartTime = MomentJS(k.startTime);
          const eventFound = eventStartTime.isSame(calendarDay, "day");
          mapCounter[eventStartTime._d] =
            mapCounter[eventStartTime._d] + 1 || 1;
          return view === "month" && eventFound && !isMobile ? (
            <div className="hasEventsContainer">
              <span className="eventLabelColor" />
              <span className="eventStartTime">
                <Moment format="HH:mma" className="eventStartTime">
                  {k.startTime}
                </Moment>
              </span>
              <h6 className="eventTitle">{k.name}</h6>
            </div>
          ) : view === "month" &&
            eventFound &&
            mapCounter[eventStartTime._d] < 2 ? (
            <div class="hasEventsContainerMobile">
              <span className="eventLabelColor" />
            </div>
          ) : null;
        })}
      </div>
    );
  };

  Today = () => this.setState({ activeDate: new Date() });

  onActiveDateChange = ({ activeStartDate, view }) =>
    this.setState({ activeDate: activeStartDate });

  render() {
    const { history } = this.props;
    const { User, events, activeDate, show, editing } = this.state;
    return (
      <Grid className="GuildCalendar Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">CALENDAR</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              disabled={!(User.is_superuser || User.can_create_calendar_event)}
              onClick={e => history.push("/calendar/new/event")}
              className="todayButton"
            >
              <i className="far fa-calendar-plus" /> Event
            </Button>
            <Button onClick={this.Today} className="todayButton pull-right">
              <i className="fas fa-calendar-day" /> Today
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Calendar
              onChange={this.onChange}
              value={activeDate}
              activeStartDate={activeDate} // fallback if value not set
              tileContent={this.hasEvents}
              minDetail={"month"}
              onActiveDateChange={this.onActiveDateChange}
              showFixedNumberOfWeeks={true}
              next2Label={null}
              prev2Label={null}
              nextLabel={<i className="fa fa-chevron-circle-right" />}
              prevLabel={<i className="fa fa-chevron-circle-left" />}
            />
          </Col>
          <Col className="EventList" lgHidden mdHidden sm={12}>
            <h2>
              <Moment format="MMM D">{activeDate}</Moment>
            </h2>
            <EventList data={events} activeDate={activeDate} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(GuildCalendar);
