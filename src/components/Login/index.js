import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.css'
import { Form, FormGroup, Grid, Row, Col, FormControl, Checkbox, Button, PageHeader, ButtonGroup, Modal} from 'react-bootstrap'
import {createUser, setUser} from '../../actions/App'
import {Redirect} from 'react-router-dom'

const mapStateToProps = ({User}) => ({
  User
})

const mapDispatchToProps = {
  setUser,
  createUser,
}

class Login extends Component {
  
  constructor(props) {
    super()
    this.onChange = this.onChange.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
 
    this.state = {
      username: '',
      password: '',
      show: false
    }
  }

  static propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
    createUser: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired
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

    this.setState({
      User
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  login = () => {
    const {username, password} = this.state
    this.props.setUser(username, password)
  }

  handleShow() {
    this.setState({show: true});
  }

  handleHide() {
    this.setState({show: false});
  }

  createUserAccount = () => {
    const {username, password, email, bio, primary_role, primary_class} = this.state
    this.props.createUser(username, password, email, bio, primary_role, primary_class)
  }

  render() {
    const {User} = this.state
    const {history} = this.props
    return (
      User.token ? <Redirect to={history.goBack()}/>
      :<Grid className="Login Container">
        <Row>
          <PageHeader className="pageHeader">LOGIN</PageHeader>
        </Row>
        <Row>
          <Form className="LoginForm" onSubmit={(e)=>console.log(e.target)}>
            <Row>
              <Col md={6} smOffset={3} sm={6}>
                <FormGroup controlId="formHorizontalUsername">
                  <FormControl type="text" name="username" placeholder="Username" onChange={this.onChange}/>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6} smOffset={3} sm={6}>
                <FormGroup controlId="formHorizontalPassword">
                  <FormControl type="password" name="password" placeholder="Password" onChange={this.onChange}/>
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
            <Row className="centerButton">
              <ButtonGroup >
                <Button onClick={this.login}>Sign in</Button>
                <Button onClick={this.handleShow}>Create Account</Button>
                <Button onClick={this.handleShow}>Forgot Password</Button>
              </ButtonGroup>
            </Row>
          </Form>
            
            <Row>
              <Modal
                {...this.props}
                show={this.state.show}
                onHide={this.handleHide}
                dialogClassName="custom-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-lg">
                    Account Creation
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form className="Container">
                    <Row>
                      <FormGroup>
                        <FormControl type="text" name="username" placeholder="Username" onChange={this.onChange}/>
                      </FormGroup>
                      <FormGroup>
                        <FormControl type="password" name="password" placeholder="Password" onChange={this.onChange}/>
                      </FormGroup>
                      <FormGroup>
                        <FormControl type="email" name="email" placeholder="Email" onChange={this.onChange}/>
                      </FormGroup>
                      <FormGroup>
                        <FormControl type="text" name="bio" placeholder="Bio" onChange={this.onChange}/>
                      </FormGroup>
                      <FormGroup>
                        <FormControl type="text" name="primary_role" placeholder="Primary Role" onChange={this.onChange}/>
                      </FormGroup>
                      <FormGroup>
                        <FormControl type="text" name="primary_class" placeholder="Primary Class" onChange={this.onChange}/>
                      </FormGroup>
                    </Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.createUserAccount}>Create</Button>
                </Modal.Footer>
              </Modal>
            </Row>
         
        </Row>
      </Grid>
    )
  }
}
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
