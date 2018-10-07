import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Row, Col, PageHeader, Tabs, Tab} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class Forums extends Component {
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
      <Grid className="Forums Container">
        <Row>
            <PageHeader className="pageHeader">FORUMS</PageHeader>
        </Row>
        <Row>
          <Col>
            <Tabs defaultActiveKey={1} className="Tabs" animation={false}>
              <Tab eventKey={1} title="Categories" className="fadeIn-2">
                Categories
              </Tab>
              <Tab eventKey={2} title="All topics" className="fadeIn-2">
                All topics
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Forums)