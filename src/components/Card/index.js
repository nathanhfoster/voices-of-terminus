import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid} from 'react-bootstrap'
import Moment from 'react-moment'
import {getEditorState} from '../../actions/TextEditor'
import './styles.css'
import axios from 'axios'
import Cookies from 'js-cookie'

const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 25000,
    headers: {
      'Authorization': "Token " + Cookies.get('LoginToken'),
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
  }
})

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
  getEditorState
}

class Card extends Component {
  constructor(props) {
    super(props)
    this.deleteArticle = this.deleteArticle.bind(this)
    this.state = {
      author: null,
      body: '',
      date_created: '',
      date_modified: '',
      id: null,
      last_modified: null,
      last_modified_by: null,
      slug: null,
      tags: '',
      title: ''
    }
  }

  static propTypes = { 
    author: PropTypes.number,
    body: PropTypes.string,
    date_created: PropTypes.object,
    date_modified: PropTypes.object,
    id: PropTypes.number,
    last_modified: PropTypes.object,
    last_modified_by: PropTypes.object,
    slug: PropTypes.string,
    tags: PropTypes.string,
    title: PropTypes.string,
    getEditorState: PropTypes.func.isRequired
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
    const {author, body, date_created, date_modified, id, last_modified, last_modified_by, slug, tags, title} = props
    this.setState({
      author, body, date_created, date_modified, id, last_modified, last_modified_by, slug, tags, title
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  removeHtmlTags = (body) => {
    let html = body
    let div = document.createElement("div")
    div.innerHTML = html;
    return div.textContent || div.innerText || ""
  }

deleteArticle = event => {
  const {id} = this.state
    Axios.delete('api/v1/articles/' + id)
    .then(response => {
     this.props.getEditorState()
   })
   .catch(error => {
     console.log(error)
   })
 }

  render() {
    const {author, body, date_created, date_modified, id, last_modified, last_modified_by, slug, tags, title} = this.state
    return (
      <Grid className="Clickable Card">
        <div className="Preview">
          <div className="previewItem">
            {this.removeHtmlTags(body)}
          </div>
        </div>
        <div className="Summary">
          <h4>Title: {title}<div onClick={this.deleteArticle}><div className="deleteCard"><i class="fa fa-trash-alt"/></div></div></h4>
          <h5>Author: {author}</h5>
          <h6>Tags: [{tags}]</h6>
          <h6>Updated <Moment fromNow>{date_modified}</Moment></h6>
        </div>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Card)