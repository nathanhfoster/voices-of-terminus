import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, PageHeader, Button} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import ReactPlayer from 'react-player'

const mapStateToProps = ({VideoToWatch}) => ({
  VideoToWatch
})

const mapDispatchToProps = {
}

class VideoPlayer extends PureComponent {
  constructor(props) {
    super(props)
 
    this.state = {
      id: '',
      pip: false,
      playing: true,
      muted: false
    }
  }

  static propTypes = {
    id: PropTypes.string,
    setVideoToWatch: PropTypes.func.isRequired
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
    const { match: { params: {id} } } = props
    this.setState({id})
  }

  pip = () => {
    const {pip} = this.state
    console.log("PIP")
    this.setState({ pip: !pip })
  }
  onEnablePIP = () => {
    console.log('onEnablePIP')
    this.setState({ pip: true })
  }
  onDisablePIP = () => {
    console.log('onDisablePIP')
    this.setState({ pip: false })
  }


  render() {
    const {id, pip, playing, muted} = this.state
    const url = `https://www.youtube.com/watch?v=${id}`
    return (
      <Grid className="VideoPlayer Container fadeIn-2">
      <Row>
        <PageHeader className="pageHeader">Watch</PageHeader>
      </Row>
        <Row>
          <Col className="videoPlayerContainer">
            <ReactPlayer
              className="videoPlayer" 
              url={url}
              playing={playing}
              height='100%'
              width='100%'
              muted={muted}
              controls
              pip={pip}
              onEnablePIP={this.onEnablePIP}
              onDisablePIP={this.onDisablePIP}
            />
            {ReactPlayer.canEnablePIP(url) &&
              <Button onClick={this.pip}><i className="fas fa-clone"/></Button>
            }
          </Col>
        </Row>        
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(VideoPlayer)