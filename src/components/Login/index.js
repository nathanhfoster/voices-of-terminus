import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.css'
import { Form, FormGroup, Grid, Row, Col, FormControl, ControlLabel, Checkbox, Button, PageHeader, ButtonGroup, Modal, Image} from 'react-bootstrap'
import {login} from '../../actions/App'
import {createUser} from '../../actions/User'
import {withRouter, Redirect} from 'react-router-dom'

const mapStateToProps = ({User}) => ({
  User
})

const mapDispatchToProps = {
  login,
  createUser
}

class Login extends Component {
  
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
 
    this.state = {
      username: '',
      password: '',
      reEnterPassword: '',
      email: '',
      bio: '',
      primaryRole: '',
      primaryClass: '', 
      primary_role: '',
      primary_class: '',
      show: false,
      rememberMe: false,
    }
  }

  static propTypes = {
    User: PropTypes.object,
    token: PropTypes.number, 
    id: PropTypes.number,
    profileImage: PropTypes.object,
    isSuperUser: PropTypes.bool, 
    isStaff: PropTypes.bool, 
    bio: PropTypes.string, 
    primaryRole: PropTypes.string,
    primaryClass: PropTypes.string, 
    username: PropTypes.string,
    password: PropTypes.string,
    createUser: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired
  }

  static defaultProps = {
    username: '',
    password: '',
    reEnterPassword: '',
    email: '',
    bio: '',
    primaryRole: '',
    primaryClass: '', 
    primary_role: '',
    primary_class: '',
    show: false,
    rememberMe: false,
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
    const {token, id} = props.User
    if(token) this.props.history.goBack()
    const {username, email, firstName, lastName, profileImage, isSuperUser, isStaff, dateJoined, lastLogin, bio, primary_role, primary_class, secondaryRole, secondaryClass, profession, professionSpecialization, discordUrl, twitterUrl, twitchUrl, youtubeUrl, guildPoints} = props
    const {password} = this.state
    this.setState({token, id, username, password, email, firstName, lastName, profileImage, isSuperUser, isStaff, dateJoined, lastLogin, bio, secondaryRole, secondaryClass, profession, professionSpecialization, dateJoined, discordUrl, twitterUrl, twitchUrl, youtubeUrl, guildPoints})
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})
  

  setImage = (e) => {
    this.setState({profile_image: e.target.files[0]})
  }

  login = (e) => {
    e.preventDefault()
    const {username, password, rememberMe} = this.state
    this.props.login(username, password, rememberMe)
  }

  handleShow = () => this.setState({username: '', password: '', show: true})

  handleHide = () => this.setState({show: false})

  createUserAccount = (e) => {
    e.preventDefault()
    const {username, password, email, bio, primary_role, primary_class, profile_image} = this.state
    
    this.props.createUser(username, password, email)
  }

  validateUsername() {
    const {username} = this.state
    if(username) {
      const {length} = username
      if (length > 4) return 'success'
      else if (length > 2) return 'warning'
      else if (length > 0) return 'error'
    }
    return null
  }

  validatePassword() {
    const {password} = this.state
    const {length} = password
    if (this.hasSpecialChar(password)) return 'success'
    else if (length > 7) return 'warning'
    else if (length > 0) return 'error'
    return null
  }

  validateReEnterPassword() {
    const {password, reEnterPassword} = this.state
    const {length} = reEnterPassword
    if(password === reEnterPassword && length > 0) return 'success'
    else if (length > 0) return 'error'
    return null
  }

  validateEmail() {
    const validator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const {email} = this.state
    if(validator.test(email)) return 'success'
    return null
  }

  cantSubmit = () => {
    if(
      (this.validateUsername() === 'success' || this.validateUsername() === 'warning')  &&
      (this.validatePassword() === 'success' || this.validatePassword() === 'warning') &&
      //(this.validateReEnterPassword() === 'success') && 
      (this.validateEmail() === 'success' || this.validateEmail() === 'warning')
    ) return true
    
    return false
  }

  hasSpecialChar = s => /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(s)

  render() {
    console.log(this.state)
    const canSubmit = !this.cantSubmit()
    const {token, username, password, email, primaryRole, primaryClass} = this.state
    return (
    <Grid className="Login Container fadeIn-2">
        <Row>
          <PageHeader className="pageHeader">LOGIN</PageHeader>
        </Row>
        <Row>
          <Form className="LoginForm" onSubmit={this.login} method="post">
            <Row>
              <Col md={6} smOffset={3} xs={12}>
                <FormGroup controlId="formHorizontalUsername">
                  <ControlLabel>Username</ControlLabel>
                  <FormControl value={username} type="text" name="username" placeholder="Username" onChange={this.onChange}/>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6} smOffset={3} xs={12}>
                <FormGroup controlId="formHorizontalPassword">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl type="password" name="password" placeholder="Password" onChange={this.onChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <FormGroup>
                <Col smOffset={3} xs={12}>
                  <Checkbox onClick={e => this.setState({rememberMe: e.target.checked})}>Remember me</Checkbox>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <Col md={12} style={{textAlign: 'center'}}>
                <ButtonGroup>
                  <Button type="submit">Sign in</Button>
                  <Button onClick={this.handleShow}>Create Account</Button>
                  <Button onClick={this.handleShow}>Forgot Password</Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Form> 
          <Row>
            <Modal
              backdrop={false}
              {...this.props}
              show={this.state.show}
              onHide={this.handleHide}
              dialogClassName="loginModal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">
                  Account Creation
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className="accontForm Container fadeIn-2">
                  <Row>
                    <Col md={12}>
                      <FormGroup validationState={this.validateUsername()}>
                        <ControlLabel>Username</ControlLabel>
                        <FormControl type="text" name="username" placeholder="Username" onChange={this.onChange}/>
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup validationState={this.validatePassword()}>
                        <ControlLabel>Password</ControlLabel>
                        <FormControl type="password" name="password" placeholder="Password" onChange={this.onChange}/>
                        <FormControl.Feedback />
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup validationState={this.validateReEnterPassword()}>
                        <ControlLabel>Re-Enter Password</ControlLabel>
                        <FormControl type="password" name="reEnterPassword" placeholder="Re-Enter Password" onChange={this.onChange}/>
                        <FormControl.Feedback />
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup validationState={this.validateEmail()}>
                        <ControlLabel>Email</ControlLabel>
                        <FormControl type="email" name="email" placeholder="Email" onChange={this.onChange}/>
                      </FormGroup>
                    </Col>
                    
                  { /* <FormGroup>
                        <ControlLabel>Profile picture</ControlLabel>
                        <FormControl type="file" label="File" name="profile_image" onChange={this.setImage} help="Example block-level help text here."/>
                      </FormGroup> */}
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.createUserAccount} disabled={canSubmit}>Create</Button>
              </Modal.Footer>
            </Modal>
          </Row>
         
        </Row>
      </Grid>
    )
  }
}
 
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Login))
