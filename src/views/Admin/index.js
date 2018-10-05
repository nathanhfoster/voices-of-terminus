import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader,ButtonToolbar, Button } from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import {Redirect} from 'react-router-dom'
import NewsLetterGenerator from '../../components/NewsLetterGenerator'

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
      :<Grid className="Admin Container">
        <Row>
        <ButtonToolbar>
          {User.token ? 
            <Button onClick={() => this.props.history.push('/articles/new/article')} className="newArticleButton">
            New Article
            </Button> : null}
            {User.isStaff ? 
              <Button onClick={() => this.props.history.push('/articles/new/newsletter')} className="newArticleButton">
              Create Newsletter
              </Button> : null}
          </ButtonToolbar>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Admin)