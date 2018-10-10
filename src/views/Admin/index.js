import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader,ButtonToolbar, Button, InputGroup, FormControl } from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import {Redirect} from 'react-router-dom'

const mapStateToProps = ({User}) => ({
  User
})

const mapDispatchToProps = {
}

class Admin extends Component {
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
    const {User} = props
    this.setState({User})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {User} = this.state
    return (
      !User.isSuperUser ? <Redirect to="/login"/>
      :<Grid className="Admin Container fadeIn-2">
      <PageHeader className="pageHeader">ADMIN</PageHeader>
        <Row>
          <Col md={4} sm={6} className="ActionToolbar" componentClass={ButtonToolbar}>
            {User.token ? 
              <Button onClick={() => this.props.history.push('/articles/new/article')} className="actionButtons">
              New Article
              </Button> : null}
              {User.isStaff ? 
                <Button onClick={() => this.props.history.push('/articles/new/newsletter')} className="actionButtons">
                Create Newsletter
                </Button> : null}
            </Col>
            <Col md={8} sm={6} className="ActionToolbar" componentClass={InputGroup}>
              <InputGroup.Addon>
                <FormControl name="filter" componentClass="select" onChange={this.onChange}>
                  <option value="article">article</option>
                  <option value="newsletter">newsletter</option>
                </FormControl>
              </InputGroup.Addon>
            <FormControl type="text" name="search" placeholder="Search..." onChange={this.onChange} />
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Admin)
