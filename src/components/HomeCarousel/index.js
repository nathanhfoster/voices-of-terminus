import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Carousel, Image} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class HomeCarousel extends PureComponent {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
    images: [
      {src: 'https://www.pantheonmmo.com/images/all-races-to-scale-wallpaper.jpg', label: 'First slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'},
      {src: 'https://www.moregameslike.com/wp-content/uploads/2016/04/Pantheon-Rise-of-the-Fallen.jpg', label: 'First slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'},
      {src: 'https://static.giantbomb.com/uploads/scale_medium/0/1992/2602381-cc862d042ce555e9ac438eb3a797502e_large.jpg', label: 'First slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'}
    ]
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderImages = Images => Images.map(img => 
    <Carousel.Item animateIn={true} animateOut={true}>
      <img className="CarouselImage Center" src={img.src}/>
      <Carousel.Caption>
        <h3>{img.label}</h3>
        <p>{img.description}</p>
      </Carousel.Caption>
    </Carousel.Item>
    )

  render() {
    const {images} = this.props
    return (
    <Carousel className="HomeCarousel Container" interval={10000}>
      {this.renderImages(images)}
    </Carousel>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(HomeCarousel)