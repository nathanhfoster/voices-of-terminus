import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'
import { Timeline } from 'react-twitter-widgets'
import { Grid, Row, Col } from 'react-bootstrap'
import YouTube from 'react-youtube'
import { Map } from 'immutable'

const mapStateToProps = ({VoTYouTubeChannelData, VRYouTubeChannelData}) => ({
  VoTYouTubeChannelData,
  VRYouTubeChannelData
})

const mapDispatchToProps = {
}

class Home extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      votLatestVideo: {},
      vrLatestVideo: {}
    }
  }

  static propTypes = {
    VoTYouTubeChannelData: new Map(),
    VRYouTubeChannelData: new Map(),
    votLatestVideo: new Map()
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  componentWillUpdate() {
  }

  /* render() */

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const votLatestVideo = props.VoTYouTubeChannelData[0]
    const vrLatestVideo = props.VRYouTubeChannelData[0]
    this.setState({
      votLatestVideo,
      vrLatestVideo
    })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render() {
    const {votLatestVideo, vrLatestVideo} = this.state
    const youTubeOpts = {
      height: '329px',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
        color: 'white',
      }
    }
    return (
      <Grid className="Home Container ">
        <Row>
          <Col lg={3} md={3} sm={3} className="newsFeed">
           <div>
              <Timeline
                    dataSource={{
                      sourceType: 'profile',
                      screenName: 'pantheon_VoT'
                    }}
                    options={{
                      username: 'Pantheon_VoT',
                      height: '366px',
                      theme: 'dark'
                    }}
                    onLoad={() => null}
                  />
           </div>
           <div>
            <Timeline
                  dataSource={{
                    sourceType: 'profile',
                    screenName: 'PantheonMMO'
                  }}
                  options={{
                    username: 'Pantheon',
                    height: '366px',
                    theme: 'dark'
                  }}
                  onLoad={() => null}
                />
           </div>
              
          </Col>
          <Col lg={6} md={6} className="newsFeed">
            <h1>Latest From VoT</h1>
            {votLatestVideo ? 
              <YouTube
              videoId={votLatestVideo.videoId}              // defaults -> null
              // id={string}                       // defaults -> null
              className="Clickable"              // defaults -> null
              // containerClassName={string}       // defaults -> ''
              opts={youTubeOpts}                   // defaults -> {}
              onReady={this._onReady}              // defaults -> noop
              // onPlay={func}                     // defaults -> noop
              // onPause={func}                    // defaults -> noop
              // onEnd={func}                      // defaults -> noop
              // onError={func}                    // defaults -> noop
              // onStateChange={func}              // defaults -> noop
              // onPlaybackRateChange={func}       // defaults -> noop
              // onPlaybackQualityChange={func}    // defaults -> noop
            /> : null
            }

            <h1>Latest From VR</h1>
            {vrLatestVideo ? 
            <YouTube
              videoId={vrLatestVideo.videoId}              // defaults -> null
              opts={youTubeOpts}                   // defaults -> {}
              onReady={this._onReady}              // defaults -> noop
            /> : null
            }
          </Col>

          <Col lg={3} md={3} sm={12} className="newsFeed">
              <iframe src="https://discordapp.com/widget?id=161500442088439808&theme=dark" allowtransparency="true" frameborder="0" height="742px" width="100%"/>
          </Col>
      </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)
