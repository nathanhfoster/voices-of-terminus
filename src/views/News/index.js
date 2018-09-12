import React, { Component } from 'react'
import ImmutableProptypes from 'react-immutable-proptypes'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Image, NavItem, Tabs, Tab,} from 'react-bootstrap'
import './styles.css'
import Moment from 'react-moment'
import { LinkContainer } from 'react-router-bootstrap'

const mapStateToProps = ({}) => ({
  
})

const mapDispatchToProps = {
}

class News extends Component {
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
      <Grid className="News Container">
        <Row>
            <PageHeader className="pageHeader">NEWS</PageHeader>
        </Row>
        <Row>
          <Col>
            <Tabs defaultActiveKey={1} className="Tabs" animation={false}>
              <Tab eventKey={1} title="Latest" className="fadeIn-2">
                Tab 1 
              </Tab>
              <Tab eventKey={2} title="Tab 2" className="fadeIn-2">
                Tab 2 content
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(News)