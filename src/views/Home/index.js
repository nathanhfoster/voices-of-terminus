import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'
import { Timeline } from 'react-twitter-widgets'
import { Grid, Row, Col, NavItem } from 'react-bootstrap'
import YouTube from 'react-youtube'
import ScrollTextBox from '../../components/ScrollTextBox'
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

  componentWillUpdate() {
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
      <Grid className="Home Container">
        <Row>
          <Col className="votDifferenceContainer fadeIn-4">
            <div className="votDifferenceText">
              <h3>The VoT Difference</h3>
              <p>
              We are the voices of those longing for community, for a family that trancends beliefs, race or blood.
              There is nothing more glorious than sharing an adventure and forming bonds with wonderful people.
              We invite you to share in our adventure in Pantheon: Rise of the Fallen.
              </p>
              <div className="SocialMediaLinks">
                <NavItem eventKey={8.1} href="http://discord.me/vot" class="fab fa-discord" target="_blank"></NavItem>
                <NavItem eventKey={8.2} href="http://twitch.tv/pantheon_vot" class="fab fa-twitch" target="_blank"></NavItem>
                <NavItem eventKey={8.3} href="https://www.youtube.com/channel/UCQ0BiIpfN9b5kUP8TA9eG1A" class="fab fa-youtube" target="_blank"></NavItem>
                <NavItem eventKey={8.4} href="https://www.facebook.com/VoicesofTerminus/" class="fab fa-facebook" target="_blank"></NavItem>
                <NavItem eventKey={8.5} href="http://twitter.com/pantheon_vot" class="fab fa-twitter" target="_blank"></NavItem>
              </div>
            </div> 
          </Col>
        </Row>
        <Row>
          <Col className="AboutContainer">
            <ScrollTextBox URL = {"/guild/roster"} Title = {"Discover"}/>
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={3} sm={3}>
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
          <Col lg={6} md={6}>
            <Row>
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
            </Row>
            <Row>
              <h1>Latest From VR</h1>
                {vrLatestVideo ? 
                <YouTube
                  videoId={vrLatestVideo.videoId}              // defaults -> null
                  opts={youTubeOpts}                   // defaults -> {}
                  onReady={this._onReady}              // defaults -> noop
                /> : null
                }
            </Row>
          </Col>

          <Col lg={3} md={3} sm={12}>
              <iframe src="https://discordapp.com/widget?id=161500442088439808&theme=dark" allowtransparency="true" frameborder="0" height="742px" width="100%"/>
          </Col>
      </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)
