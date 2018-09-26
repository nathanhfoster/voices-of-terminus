import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import './styles.css'
import { Form, FormGroup, Grid, Row, Col, FormControl, Checkbox, Button, PageHeader} from 'react-bootstrap'
import {setLoginToken} from '../../actions/App'
import {withRouter} from 'react-router-dom'

const mapStateToProps = ({}) => ({
  
})

const mapDispatchToProps = {
  setLoginToken
}

class Login extends Component {
  
  constructor(props) {
    super()
 
    this.state = {
      username: '',
      password: ''
    }
  }

  static propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
    setLoginToken: PropTypes.func.isRequired
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
    this.setState({
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  onChange = (e) => {
    switch(e.target.type) {
      case 'text':
        this.setState({username: e.target.value})
        break;
      case 'password':
      this.setState({password: e.target.value})
      break;
    }
  }

  login = () => {
    const {username, password} = this.state
    this.props.setLoginToken(username, password)
  }

  render() {
    return (
      <Grid className="Login Container">
        <Row>
          <PageHeader className="pageHeader">LOGIN</PageHeader>
        </Row>
        <Row>
          <Col>
            <Form className="LoginForm">
          <Row>
            <Col md={6} smOffset={3} sm={6}>
              <FormGroup controlId="formHorizontalUsername">
                <FormControl type="text" placeholder="Username" onChange={this.onChange}/>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6} smOffset={3} sm={6}>
              <FormGroup controlId="formHorizontalPassword">
                <FormControl type="password" placeholder="Password" onChange={this.onChange}/>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col smOffset={3} sm={6}>
              <FormGroup>
                <Checkbox>Remember me</Checkbox>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col smOffset={3} sm={6}>
              <FormGroup>
                  <Button onClick={this.login}>Sign in</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
          </Col>
        </Row>
        
      </Grid>
    );
  }
}
 
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Login))
