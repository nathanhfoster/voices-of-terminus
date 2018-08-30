import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import { Timeline } from 'react-twitter-widgets'
import { Grid, Row, Col } from 'react-bootstrap'
import YouTube from 'react-youtube'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Home extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  getState = props => {
    this.setState({
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
    const youTubeOpts = {
      height: '329px',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
        color: 'white',
      }
    }
    return (
      <Grid className="HomeContainer">
        <Row>
          <Col className="votDifferenceContainer">
            <h5>The VOT Difference</h5>
              <p>
                We are the voices of those longing for community, for a family that trancends beliefs, race or blood.
                There is nothing more glorious than sharing an adventure and forming bonds with wonderful people. We
                invite you to share in our adventure in Pantheon: Rise of the Fallen.
              </p>
            </Col>
          </Row>
          <Row>
          <Col lg={3} md={3} sm={3} xs={12}>
              <Timeline
                dataSource={{
                  sourceType: 'profile',
                  screenName: 'pantheon_VoT'
                }}
                options={{
                  username: 'Pantheon_VoT',
                  height: '275px',
                  theme: 'dark'
                }}
                onLoad={() => console.log('Timeline is loaded!')}
              />
              <Timeline
                dataSource={{
                  sourceType: 'profile',
                  screenName: 'PantheonMMO'
                }}
                options={{
                  username: 'Pantheon',
                  height: '275px',
                  theme: 'dark'
                }}
                onLoad={() => console.log('Timeline is loaded!')}
              />
          </Col>

          <Col lg={6} md={6} sm={6} xs={12}>
              <YouTube
                videoId="3R-zraIkFQI"                // defaults -> null
                // id={string}                       // defaults -> null
                // className={string}                // defaults -> null
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
              />
          </Col>

          <Col lg={3} md={3} sm={3} xs={12}>
            <div>
              <iframe src="https://discordapp.com/widget?id=161500442088439808&theme=dark" height="557px" allowtransparency="true" frameborder="0"/>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)