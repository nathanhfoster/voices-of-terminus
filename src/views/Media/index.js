import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.css'
import {Grid, Row, Col, Image} from 'react-bootstrap'
import imageGallery from '../../images/media-images.png'
import videoGallery from '../../images/media-videos.png'
import streamGallery from '../../images/media-streams.png'
import podcastGallery from '../../images/media-podcasts.png'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Media extends Component {
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

  render() {
    return (
      <Grid className="MediaContainer">
        <Row>
          <Col md={6}>
            <Image src={imageGallery} responsive />
          </Col>
          <Col md={6}>
            <Image src={videoGallery} responsive />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Image src={streamGallery} responsive />
          </Col>
          <Col md={6}>
            <Image src={podcastGallery} responsive />
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Media)