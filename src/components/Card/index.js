import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Map, List} from 'immutable'
import {Grid, Button} from 'react-bootstrap'
import Moment from 'react-moment'
import './styles.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class Card extends Component {
  constructor(props) {
    super(props)
    this.deleteThisCard = this.deleteThisCard.bind(this)
    this.editThisCard = this.editThisCard.bind(this)
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
    date_created: PropTypes.Date,
    date_modified: PropTypes.Date,
    id: PropTypes.number,
    last_modified: PropTypes.Date,
    last_modified_by: PropTypes.Date,
    slug: PropTypes.string,
    tags: PropTypes.string,
    title: PropTypes.string
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
    const {author, html, design, date_created, date_modified, id, last_modified, last_modified_by, slug, tags, title} = props
    this.setState({author, html, design, date_created, date_modified, id, last_modified, last_modified_by, slug, tags, title})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  showArticle = id => {

  }

  deleteThisCard = id => this.props.deleteItem(id)

  editThisCard = id => {
    this.props.editCard(id)
    this.props.history.push('/articles/edit/newsletter/' + id + '/')
  }

  render() {
    const {author, html, desgin, date_created, date_modified, id, last_modified, last_modified_by, slug, tags, title} = this.state
    return (
      <Grid className="Clickable Card" onClick={()=>this.props.history.push('/news/' + id.toString())}>
        <div className="Preview">
          <div className="previewItem">
            {ReactHtmlParser(html)}
          </div>
        </div>
        <div className="Summary">
          <h4>
            Title: {title}
            <Button onClick={(e) => {e.stopPropagation(); this.deleteThisCard(id)}} className="cardActions"><i className="fa fa-trash-alt"/></Button>
            <Button onClick={(e) => {e.stopPropagation(); this.editThisCard(id)}} className="cardActions"><i className="fa fa-pencil-alt"/></Button>
          </h4>
          <h5>Author: {author}</h5>
          <h6>Tags: [{tags}]</h6>
          <h6>Updated <Moment fromNow>{date_modified}</Moment></h6>
        </div>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Card))