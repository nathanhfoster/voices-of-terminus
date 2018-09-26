import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.css'
import { Form, FormGroup, Grid, Row, Col, FormControl, Checkbox, Button, PageHeader} from 'react-bootstrap'
import {login} from '../../actions/App'

const mapStateToProps = () => ({

})

const mapDispatchToProps = dispatch => {

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
    password: PropTypes.string
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

  submit = () => {
    const {username, password} = this.state
    login(username, password)
  }

  render() {
    return (
      <Grid className="Login Container">
        <Row>
          <PageHeader className="pageHeader">LOGIN</PageHeader>
        </Row>
        <Row>
          <Col>
            <Form className="LoginForm" onSubmit={this.submit.bind(this)}>
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
                  <Button onClick={this.submit}>Sign in</Button>
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
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
