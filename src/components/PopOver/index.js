import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, OverlayTrigger, Popover } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class PopOver extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, children } = props;
    this.setState({ User, children });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { User, children } = this.state;
    const { token } = User;

    const popover = (
      <Popover id="popover-basic" title={null}>
        {React.Children.map(children, child => (
          <div className="PopRow">{child}</div>
        ))}
      </Popover>
    );
    return token ? (
      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <div
          variant="success"
          className="ActionDots pull-right"
          onClick={e => e.stopPropagation()}
        >
          <i className="fas fa-ellipsis-v pull-left" variant="success" />
        </div>
      </OverlayTrigger>
    ) : null;
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PopOver);
