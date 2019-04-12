import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col, Image, NavItem } from "react-bootstrap";
import "./styles.css";
import Moment from "react-moment";
import { LinkContainer } from "react-router-bootstrap";
import VideoCard from "./VideoCard";

const mapStateToProps = ({ VoTYouTubeChannelData }) => ({
  VoTYouTubeChannelData
});

const mapDispatchToProps = {};

class Videos extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      VoTYouTubeChannelData: [],
      history: {}
    };
  }

  static propTypes = {
    VoTYouTubeChannelData: PropTypes.array,
    history: PropTypes.object
  };

  static defaultProps = {
    VoTYouTubeChannelData: []
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    let { VoTYouTubeChannelData } = props;
    VoTYouTubeChannelData = VoTYouTubeChannelData.filter(e => e.videoId);
    this.setState({ VoTYouTubeChannelData });
  };

  renderVideos = videos => videos.map(video => <VideoCard {...video} />);

  render() {
    const { VoTYouTubeChannelData } = this.state;
    return (
      <Grid className="Videos Container fadeIn">
        {this.renderVideos(VoTYouTubeChannelData)}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Videos);
