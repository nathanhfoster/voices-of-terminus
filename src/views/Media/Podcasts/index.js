import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Grid } from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import PodcastCard from "./PodcastCard";
import { getVotPlaylistShow } from "../../../actions/App";

const mapStateToProps = ({ VotPlaylistShow }) => ({
  VotPlaylistShow
});

const mapDispatchToProps = {
  getVotPlaylistShow
};

class Podcasts extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = { VotPlaylistShow: PropTypes.array };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    this.props.getVotPlaylistShow();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    let { VotPlaylistShow } = props;
    VotPlaylistShow = VotPlaylistShow.filter(p => p.thumbnail).map(p => {
      p.videoId = p.thumbnail.split("/")[4];
      return p;
    });
    this.setState({ VotPlaylistShow });
  };

  renderPlaylistItems = playlist =>
    playlist.map(podcast => <PodcastCard {...podcast} />);

  render() {
    const { VotPlaylistShow } = this.state;
    return (
      <Grid className="Podcasts Container fadeIn">
        {this.renderPlaylistItems(
          VotPlaylistShow.sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
          )
        )}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Podcasts);
