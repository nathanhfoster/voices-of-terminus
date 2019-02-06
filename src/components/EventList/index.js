import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Moment from "react-moment";
import MomentJS from "moment";
import "./styles.css";
import "./stylesM.css";

const mapStateToProps = ({}) => ({});

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
    activeDate: PropTypes.Date,
    data: PropTypes.array
  };

  static defaultProps = {
    activeDate: Date,
    data: []
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillUpdate() {}

  componentDidMount() {}
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

  componentDidUpdate() {}

  componentWillUnmount() {}

  renderItems = (date, data) =>
    data.map((k, i) => {
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
        min_level,
        max_level,
        role_preferences,
        class_preferences,
        location,
        congregation_size
      } = k;
      const activeDate = MomentJS.utc(date);
      const startDate = MomentJS.utc(start_date);
      const sameDayEvent = startDate.isSame(activeDate, "day");
      return (
        <div key={i}>
          {sameDayEvent ? (
            <ListGroupItem
              key={id}
              className="Clickable listItem"
              header={title}
            >
              <span className="EventColorLabelContainer" />
              <Moment format="hh:mm a - ">{start_date}</Moment>
              <Moment format="hh:mm a">{end_date}</Moment>
            </ListGroupItem>
          ) : null}
        </div>
      );
    });

  render() {
    const { data, activeDate } = this.state;
    return (
      <ListGroup className="List">
        {this.renderItems(activeDate, data)}
      </ListGroup>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EventList);
