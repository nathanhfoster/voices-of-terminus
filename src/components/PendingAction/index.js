import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class PendingAction extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = { ShouldShow: true, Disabled: false };

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const {
      ShouldShow,
      Disabled,
      Click,
      ActionPending,
      ActionComplete,
      ActionError,
      ActionName
    } = props;
    this.setState({
      ShouldShow,
      Disabled,
      Click,
      ActionPending,
      ActionComplete,
      ActionError,
      ActionName
    });
  };

  switchActionIcon = ActionName => {
    return null;
    switch (ActionName) {
      case "POST":
        return <i className="fas fa-paper-plane" />;
      case "UPDATE":
        return <i className="fas fa-pen-fancy" />;
      default:
        return null;
    }
  };

  render() {
    const {
      ShouldShow,
      Disabled,
      Click,
      ActionPending,
      ActionComplete,
      ActionError,
      ActionName
    } = this.state;
    return ShouldShow ? (
      <Button
        className="PendingAction"
        disabled={Disabled}
        type="submit"
        onClick={Click}
      >
        {ActionPending && !ActionComplete
          ? [<i className="fa fa-spinner fa-spin" />, ActionName]
          : !ActionPending && ActionComplete && !ActionError
          ? [
              <i
                className="fas fa-check"
                style={{ color: "var(--color_emerald)" }}
              />,
              ActionName
            ]
          : [this.switchActionIcon(ActionName), ActionName]}
      </Button>
    ) : null;
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PendingAction);
