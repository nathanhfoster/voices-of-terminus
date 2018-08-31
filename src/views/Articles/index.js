import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader } from 'react-bootstrap'
import './styles.css'

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
          <Col>
            
          </Col>
        </Row>

      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Articles)