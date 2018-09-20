import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import { Form, FormGroup, Grid, Row, Col, FormControl, Checkbox, Button, PageHeader} from 'react-bootstrap'

const mapStateToProps = () => ({

})

const mapDispatchToProps = dispatch => {

}

class Login extends Component {
  
  constructor(props) {
    super()
 
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
    this.setState({
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
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
          </Col>
        </Row>
        
      </Grid>
    );
  }
}
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
