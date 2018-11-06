import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, PageHeader} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'
import {getUser} from '../../../actions/App'
import {withRouter} from 'react-router-dom'

const mapStateToProps = ({Admin}) => ({
  Admin
})

const mapDispatchToProps = {
  getUser
}

class OtherProfile extends Component {
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

  componentWillUpdate() {
  }

  componentDidMount() {
    const {id} = this.props.match.params
    this.props.getUser(id)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User} = props.Admin
    this.setState({User})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {User} = this.state
    return (
      User ? <Grid className="OtherProfile Container">
        <Row>
          <PageHeader className="pageHeader">{User.username.toUpperCase()}</PageHeader>
        </Row>
        <Row>
          
        </Row>
      </Grid> : null 
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(OtherProfile))