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
import { getYearMonthEvents } from "../../actions/Events";

const mapStateToProps = ({ User, Window, Events }) => ({
  User,
  Window,
  Events
});

const mapDispatchToProps = { getYearMonthEvents };

class GuildCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: null,
      Events: PropTypes.array,
      isMobile: false,
      show: false,
      editing: false
    };
  }

  static propTypes = {
    activeDate: PropTypes.Date,
    Events: PropTypes.array,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    activeDate: new Date(),
    Events: [
      {
        key: 1,
        title: "Event 1",
        start_date: new Date(2018, 11, 3, 10, 30),
        end_date: new Date(2018, 11, 3, 12, 30)
      },
      {
        key: 2,
        title: "Event 2",
        start_date: new Date(2018, 11, 3, 10, 30),
        end_date: new Date(2018, 11, 3, 12, 30)
      },
      {
        key: 3,
        title: "Event 3",
        start_date: new Date(2018, 11, 4, 10, 30),
        end_date: new Date(2018, 11, 4, 12, 30)
      },
      {
        key: 4,
        title: "Event 4",
        start_date: new Date(2018, 11, 4, 10, 30),
        end_date: new Date(2018, 11, 4, 12, 30)
      },
      {
        key: 5,
        title: "Event 5",
        start_date: new Date(2018, 11, 24, 10, 30),
        end_date: new Date(2018, 11, 4, 12, 30)
      },
      {
        key: 6,
        title: "Event 6",
        start_date: new Date(2018, 11, 5, 10, 30),
        end_date: new Date(2018, 11, 4, 12, 30)
      },
      {
        key: 7,
        title: "Event 7",
        start_date: new Date(2018, 11, 5, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 8,
        title: "Event 8",
        start_date: new Date(2018, 11, 25, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 9,
        title: "Event 9",
        start_date: new Date(2018, 11, 25, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 10,
        title: "Event 10",
        start_date: new Date(2018, 11, 25, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 11,
        title: "Event 11",
        start_date: new Date(2018, 11, 25, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 12,
        title: "Event 12",
        start_date: new Date(2018, 11, 25, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 13,
        title: "Event 13",
        start_date: new Date(2018, 11, 25, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 14,
        title: "Event 14",
        start_date: new Date(2018, 11, 25, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      },
      {
        key: 15,
        title: "Event 14",
        start_date: new Date(2018, 8, 25, 10, 30),
        end_date: new Date(2018, 11, 5, 12, 30)
      }
    ]
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { getYearMonthEvents, activeDate } = this.props;
    const payload = { date: activeDate };
    getYearMonthEvents(payload);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Events, Window } = props;
    const { activeDate } = this.state.activeDate ? this.state : props;
    this.setState({ User, activeDate, Events, Window });
  };

  onChange = activeDate => this.setState({ activeDate });

  hasEvents = ({ date, view }) => {
    const { Events } = this.state;
    const { isMobile } = this.state.Window;
    let mapCounter = {}; // Use to display only 1 eventLabelColor per day for mobile
    return (
      <div class="TileContent">
        {Events.results.map(k => {
          const calendarDay = MomentJS(date);
          const start_date = MomentJS(k.start_date);
          const eventFound = start_date.isSame(calendarDay, "day");
          mapCounter[start_date._d] = mapCounter[start_date._d] + 1 || 1;
          return view === "month" && eventFound && !isMobile ? (
            <div className="hasEventsContainer">
              <span className="eventLabelColor" />
              <span className="startDate">
                <Moment format="hh:mma">{k.start_date}</Moment>
              </span>
              <h6 className="eventTitle">{k.title}</h6>
            </div>
          ) : view === "month" &&
            eventFound &&
            mapCounter[start_date._d] < 2 ? (
            <div class="hasEventsContainerMobile">
              <span className="eventLabelColor" />
            </div>
          ) : null;
        })}
      </div>
    );
  };

  Today = () => this.setState({ activeDate: new Date() });

  onActiveDateChange = ({ activeStartDate, view }) => {
    const { getYearMonthEvents } = this.props;
    const payload = { date: activeStartDate };
    getYearMonthEvents(payload);
    this.setState({ activeDate: activeStartDate });
  };

  render() {
    const { history } = this.props;
    const { User, Events, activeDate, show, editing } = this.state;
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
            <EventList data={Events.results} activeDate={activeDate} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(GuildCalendar);
