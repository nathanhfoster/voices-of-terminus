import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.css'
import { Form, FormGroup, Grid, Row, Col, FormControl, ControlLabel, Checkbox, Button, PageHeader, ButtonGroup, Modal, Image} from 'react-bootstrap'
import {createUser, login} from '../../actions/App'
import {Redirect} from 'react-router-dom'
import cleric from '../../images/cleric.png'

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
      email: '',
      primary_role: '',
      primary_class: '',
      show: false,
    }
  }

  static propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
    createUser: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired
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
    const {User} = props

    this.setState({User})
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})
  

  setImage = (e) => {
    this.setState({profile_image: e.target.files[0]})
  }

  login = (e) => {
    e.preventDefault()
    const {username, password} = this.state
    this.props.login(username, password)
  }

  handleShow = () => this.setState({show: true})

  handleHide = () => this.setState({show: false})

  createUserAccount = (e) => {
    e.preventDefault()
    const {username, password, email, bio, primary_role, primary_class, profile_image} = this.state
    this.props.createUser(username, password, email, bio, primary_role, primary_class)
  }

  validateUsername() {
    const {username} = this.state
    const {length} = username
    if (length > 4) return 'success'
    else if (length > 2) return 'warning'
    else if (length > 0) return 'error'
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

  validateEmail() {
    const validator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const {email} = this.state
    const {length} = email
    if(validator.test(email)) return 'success'
    return null
  }

  cantSubmit = () => {
    if(
      (this.validateUsername() === 'success' || this.validateUsername() === 'warning')  &&
      (this.validatePassword() === 'success' || this.validatePassword() === 'warning') &&
      (this.validateEmail()    === 'success' || this.validateEmail()    === 'warning')
    ) return true
    
    return false
  }

  hasSpecialChar = s => /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(s)

  render() {
    const {User, isNotValid} = this.state
    const canSubmit = !this.cantSubmit()
    return (
      User.token ? <Redirect to={this.props.history.goBack()}/>
      :<Grid className="Login Container fadeIn-2">
        <Row>
          <PageHeader className="pageHeader">LOGIN</PageHeader>
        </Row>
        <Row>
          <Form className="LoginForm" onSubmit={this.login} method="post">
            <Row>
              <Col md={6} smOffset={3} xs={12}>
                <FormGroup controlId="formHorizontalUsername">
                  <ControlLabel>Username</ControlLabel>
                  <FormControl type="text" name="username" placeholder="Username" onChange={this.onChange}/>
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
            <Row className="centerButtons">
              <ButtonGroup>
                <Button type="submit">Sign in</Button>
                <Button onClick={this.handleShow}>Create Account</Button>
                <Button onClick={this.handleShow}>Forgot Password</Button>
              </ButtonGroup>
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
                      <FormGroup validationState={this.validateUsername()}>
                        <ControlLabel>Username</ControlLabel>
                        <FormControl type="text" name="username" placeholder="Username" onChange={this.onChange}/>
                      </FormGroup>
                      <FormGroup validationState={this.validatePassword()}>
                        <ControlLabel>Password</ControlLabel>
                        <FormControl type="password" name="password" placeholder="Password" onChange={this.onChange}/>
                        <FormControl.Feedback />
                      </FormGroup>
                      <FormGroup validationState={this.validateEmail()}>
                        <ControlLabel>Email</ControlLabel>
                        <FormControl type="email" name="email" placeholder="Email" onChange={this.onChange}/>
                      </FormGroup>
                    { /* <FormGroup>
                          <ControlLabel>Profile picture</ControlLabel>
                          <FormControl type="file" label="File" name="profile_image" onChange={this.setImage} help="Example block-level help text here."/>
                        </FormGroup> */}
                      <FormGroup>
                        <ControlLabel>Bio</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="Bio" onChange={this.onChange}/>
                      </FormGroup>
                      <Col md={6}>
                        <FormGroup >
                          <ControlLabel>Primary Role</ControlLabel>
                          <FormControl name="primary_role" componentClass="select" onChange={this.onChange}>
                            <option value="">SELECT</option>
                            <option value="Tank">TANK</option>
                            <option value="Healer">HEALER</option>
                            <option value="Tank">DPS</option>
                            <option value="Healer">SUPPORT</option>
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup >
                          <ControlLabel>Primary Class</ControlLabel>
                          <FormControl name="primary_class" componentClass="select" onChange={this.onChange} id="dropDown">
                            <option value="">SELECT</option>
                            <option value="Cleric">CLERIC</option>
                            <option value="Dire Lord">DIRE LORD</option>
                            <option value="Druid">DRUID</option>
                            <option value="Enchanter">ENCHANTER</option>
                            <option value="Monk">MONK</option>
                            <option value="Paladin">PALADIN</option>
                            <option value="Ranger">RANGER</option>
                            <option value="Rogue">ROGUE</option>
                            <option value="Shaman">SHAMAN</option>
                            <option value="Summoner">SUMMONER</option>
                            <option value="Warrior">WARRIOR</option>
                            <option value="Wizard">WIZARD</option>
                          </FormControl>
                        </FormGroup>
                      </Col>
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
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
