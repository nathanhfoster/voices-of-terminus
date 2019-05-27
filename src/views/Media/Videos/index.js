import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Grid } from "react-bootstrap";
import "./styles.css";
import VideoCard from "./VideoCard";
import { getVoTYouTubeChannelData } from "../../../actions/APIs/YouTube";

const mapStateToProps = ({ VoTYouTubeChannelData }) => ({
  VoTYouTubeChannelData
});

const mapDispatchToProps = { getVoTYouTubeChannelData };

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

  componentDidMount() {
    const { getVoTYouTubeChannelData } = this.props;
    getVoTYouTubeChannelData();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    let { VoTYouTubeChannelData } = props;
    VoTYouTubeChannelData.latest = VoTYouTubeChannelData.latest.filter(
      e => e.videoId
    );
    this.setState({ VoTYouTubeChannelData });
  };

  renderVideos = videos => videos.map(video => <VideoCard {...video} />);

  render() {
    const { VoTYouTubeChannelData } = this.state;
    const { latest } = VoTYouTubeChannelData;
    return (
      <Grid className="Videos Container fadeIn">
        {this.renderVideos(latest)}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Videos);
