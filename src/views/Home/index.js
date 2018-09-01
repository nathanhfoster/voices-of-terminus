import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import { Timeline } from 'react-twitter-widgets'
import { Grid, Row, Col, PageHeader } from 'react-bootstrap'
import { Link } from 'react-router-dom'
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
            <h3>The VoT Difference</h3>
            <p>
              We are the voices of those longing for community, for a family that trancends beliefs, race or blood.
              There is nothing more glorious than sharing an adventure and forming bonds with wonderful people. We
              invite you to share in our adventure in Pantheon: Rise of the Fallen.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="AboutContainer">
            <Link to="/guild/roster" className="AboutButton"><span className="fadeIn-8">DISCOVER</span></Link>
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
                      height: '275px',
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
                    height: '275px',
                    theme: 'dark'
                  }}
                  onLoad={() => null}
                />
           </div>
              
          </Col>
          <Col lg={6} md={6}>
            <Row>
                <h2>Latest VoT</h2>
              <YouTube
              videoId="3R-zraIkFQI"                // defaults -> null
              // id={string}                       // defaults -> null
              // className="youTube"              // defaults -> null
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
            </Row>
            <Row>
              <h2>Latest VR</h2>
              <YouTube
              videoId="eq6ftMk21FA"                // defaults -> null
              // id={string}                       // defaults -> null
              // className="youTube"              // defaults -> null
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
            </Row>
             
          </Col>

          <Col lg={3} md={3} sm={12}>
              <iframe src="https://discordapp.com/widget?id=161500442088439808&theme=dark" allowtransparency="true" frameborder="0" className="discord"/>
          </Col>
      </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)
