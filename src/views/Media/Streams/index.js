import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { getVotTwitchStreams } from "../../../actions/Api";
import { Grid } from "react-bootstrap";
import StreamCard from "./StreamCard";

const mapStateToProps = ({ VotTwitchStreams }) => ({ VotTwitchStreams });

const mapDispatchToProps = { getVotTwitchStreams };

class Streams extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    VotTwitchStreams: PropTypes.array
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { getVotTwitchStreams } = this.props;
    getVotTwitchStreams();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { VotTwitchStreams } = props;
    this.setState({ VotTwitchStreams });
  };

  renderStreams = streams => streams.map(stream => <StreamCard {...stream} />);

  render() {
    const { _total, _links, videos } = this.state.VotTwitchStreams;
    return (
      <Grid className="Streams Container fadeIn">
        {this.renderStreams(videos)}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Streams);
