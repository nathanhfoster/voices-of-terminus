import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
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
    this.setState({
      User
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {User} = this.state
    return (
      !User.isSuperUser ? <Redirect to="/login"/>
      : <div className="Admin">
        Admin
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Admin)