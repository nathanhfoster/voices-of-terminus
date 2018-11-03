import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, Image} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import skar from '../../images/backgrounds/skar.png'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class PageNotFound extends Component {
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
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  render() {
    return (
      <Grid className="PageNotFound Container fadeIn-2">
        <Row className="pageNotFoundContainer">
          <Col className="pageNotFoundImage" md={4} xs={6}>
            <Image src={skar}  responsive/>
          </Col>
          <Col className="pageNotFoundMessage" md={8}>
            <h1>Page Not Found</h1>
            <h4>Try again, filthy human.</h4>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PageNotFound)