import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Moment from "react-moment";
import MomentJS from "moment";
import "./styles.css";
import "./stylesM.css";
import { eventLabelColor } from "../../helpers";

const mapStateToProps = ({ }) => ({});

const mapDispatchToProps = {};

class EventList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: Date,
      data: []
    };
  }

  static propTypes = {
    activeDate: PropTypes.string,
    data: PropTypes.array
  };

  static defaultProps = {
    activeDate: Date,
    data: []
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillUpdate() { }

  componentDidMount() { }
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { activeDate, data } = props;
    this.setState({
      activeDate,
      data
    });
  };

  componentDidUpdate() { }

  componentWillUnmount() { }

  renderItems = (date, events, history) =>
    events.map((e, i) => {
      const {
        id,
        start_date,
        end_date,
        title,
        description,
        author,
        author_username,
        last_modified_by,
        tags,
        sub_tags,
        min_level,
        max_level,
        role_preferences,
        class_preferences,
        location,
        group_size
      } = e;
      const activeDate = MomentJS(date);
      const startDate = MomentJS(start_date);
      const sameDayEvent = startDate.isSame(activeDate, "day");
      return (
        <div key={i} style={{ borderRadius: 0 }}>
          {sameDayEvent ? (
            <ListGroupItem
              key={id}
              onClick={e => history.push(`/calendar/event/${id}`)}
              className="Clickable listItem"
              header={title}
            >
              <span
                className="EventColorLabelContainer"
                style={{ backgroundColor: eventLabelColor(tags, sub_tags) }}
              />
              <Moment format="hh:mm a - ">{start_date}</Moment>
              <Moment format="hh:mm a">{end_date}</Moment>
            </ListGroupItem>
          ) : null}
        </div>
      );
    });

  render() {
    const { history } = this.props;
    const { data, activeDate } = this.state;
    return [
      <div className="ListHeader Center">Events</div>,
      <ListGroup className="List">
        {this.renderItems(activeDate, data, history)}
      </ListGroup>
    ];
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EventList);
