import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class LoadingScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillUpdate() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="LoadingScreenContainer">
        <div id="Loading" />
      </div>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
