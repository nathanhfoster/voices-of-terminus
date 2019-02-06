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

  renderItems = data =>
    data.map(k => {
      const activeDate = MomentJS(this.state.activeDate);
      const start_time = MomentJS(k.start_time);
      const sameDayEvent = start_time.isSame(activeDate, "day");

      return (
        <div>
          {sameDayEvent ? (
            <ListGroupItem className="Clickable listItem" header={k.title}>
              <span className="EventColorLabelContainer" />
              <Moment format="hh:mm a - ">{k.start_time}</Moment>
              <Moment format="hh:mm a">{k.end_date}</Moment>
            </ListGroupItem>
          ) : null}
        </div>
      );
    });

  render() {
    const { data } = this.state;
    return <ListGroup className="List">{this.renderItems(data)}</ListGroup>;
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EventList);
