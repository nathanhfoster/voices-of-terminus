import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import {Grid, Row, Col, Image, PageHeader} from 'react-bootstrap'
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
    images: PropTypes.array
  }

  static defaultProps = {
    images: [imageGallery, videoGallery, streamGallery, podcastGallery]
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

  renderImages = images => images.map(k => {
    return (
      <Col lg={6} md={6} sm={12} xs={12}>
        <Image src={k} responsive />
      </Col>
    )
  })

  render() {
    const {images} = this.props
    return (
      <Grid className="MediaContainer">
        <Row>
          <PageHeader className="pageHeader">MEDIA</PageHeader>
        </Row>
        <Row>
          {this.renderImages(images)}
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Media)