import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, PageHeader} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import {withRouter, Redirect} from 'react-router-dom'
import {getUser} from '../../../actions/Admin'
import './styles.css'
import './stylesM.css'

const mapStateToProps = ({Admin, User}) => ({
  Admin,
  User
})

const mapDispatchToProps = {
  getUser
}

class UserProfile extends Component {
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
    const {id} = this.props.match.params
    this.props.getUser(id)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Admin, match} = props
    const {id} = match.params

    this.setState({Admin, match, id})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {Admin} = this.state
    const {User} = Admin
    console.log(this.state)
    return (
      !this.props.User.isSuperUser ? <Redirect to={this.props.history.goBack()}/>
      :<Grid className="UserProfile Container">
        <Row>
          <PageHeader className="pageHeader">PROFILE</PageHeader>
        </Row>
        <Row>
          <Col md={12}>
            {JSON.stringify(User)}
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(UserProfile))