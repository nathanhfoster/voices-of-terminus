import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader } from 'react-bootstrap'
import './styles.css'
import Card from '../../components/Card'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Articles extends Component {
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
      <Grid className="Articles Container">
        <Row>
            <PageHeader className="pageHeader">ARTICLES</PageHeader>
        </Row>

        <Row>
          <h3>Higlights</h3>
          <Col md={3} sm={12} xs={12}>
            <Card />
          </Col>
          <Col md={3} sm={12} xs={12}>
            <Card />
          </Col>
          <Col md={3} sm={12} xs={12}>
            <Card />
          </Col>
          <Col md={3} sm={12} xs={12}>
            <Card />
          </Col>
        </Row>

        <Row>
          <h3>Recent</h3>
          <Col>
            
          </Col>
        </Row>

      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Articles)