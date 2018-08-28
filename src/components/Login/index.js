import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import {Form, FormGroup, Row, Col, ControlLabel, FormControl, Checkbox, Button} from 'react-bootstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope'

const mapStateToProps = () => ({

})

const mapDispatchToProps = dispatch => {

}

class Login extends Component {
  
  constructor(props) {
    super();
 
    this.state = {
    
    };
  }

  static propTypes = {
    
  }

  static defaultProps = {

  }
  
  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
 
  }

  render() {
    return (
      <Form className="loginForm">
        <Row>
          <Col md={6} smOffset={3} sm={6}>
            <FormGroup controlId="formHorizontalEmail">
              <FormControl type="email" placeholder="Email"/>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6} smOffset={3} sm={6}>
            <FormGroup controlId="formHorizontalPassword">
              <FormControl type="password" placeholder="Password" />
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
                <Button type="submit">Sign in</Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
