import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, PageHeader} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import ReactPlayer from 'react-player'

const mapStateToProps = ({VideoToWatch}) => ({
  VideoToWatch
})

const mapDispatchToProps = {
}

class VideoPlayer extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      id: '',
      Video: {}
    }
  }

  static propTypes = {
    id: PropTypes.string,
    Video: {},
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

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }
  render() {
    const {id} = this.state
    return (
      <Grid className="VideoPlayer Container fadeIn-2">
      <Row>
        <PageHeader className="pageHeader">Watch</PageHeader>
      </Row>
        <Row>
          <Col className="videoPlayerContainer">
            <ReactPlayer
              className="videoPlayer" 
              url={`https://www.youtube.com/watch?v=${id}`}
              playing
              height='100%'
              width='100%'
              controls
            />
          </Col>
        </Row>        
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(VideoPlayer)