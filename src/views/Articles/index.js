import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, ButtonToolbar, Button, InputGroup, FormControl} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import Card from '../../components/Card'
import {getArticles} from '../../actions/Articles'
import {withRouter} from 'react-router-dom'
import {getArticle, updateArticle, deleteArticle} from '../../actions/Articles'

const mapStateToProps = ({Articles, User}) => ({
  Articles,
  User
})

const mapDispatchToProps = {
  getArticle,
  getArticles,
  updateArticle,
  deleteArticle
}

class Articles extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      Articles: []
    }
  }

  static propTypes = {
    Articles: PropTypes.array,
    getArticles: PropTypes.func.isRequired
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    this.props.getArticles()
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Articles, User} = props
    this.setState({Articles, User})
  }

  renderCards = Articles => Articles.map(card => 
      <Col className="CardContainer" md={3}>
        <Card
          {...card}
          click={() => {this.props.getArticle(card.id); this.props.history.push('/articles/' + card.id)}}
          editCard={this.props.getArticle}
          deleteCard={this.props.deleteArticle}
          summary={true}
        />
      </Col>
  )

  onChange = (e) => {
    const query = e.target.value.toLowerCase()
    const Articles = this.props.Articles.filter(article => {
      const title = article.title ? article.title.toLowerCase() : ' '
      const tags = article.tags ? article.tags.toLowerCase() : ' '
      if(title.includes(query) || tags.includes(query)) return true
      return false
    })
    this.setState({Articles, [e.target.name]: e.target.value})
}

  render() {
    const {Articles, User} = this.state
    return (
      <Grid className="Articles Container fadeIn-2">
        <Row>
          <PageHeader className="pageHeader">ARTICLES</PageHeader>
        </Row>
        <Row>
          <Col md={4} xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
              <Button onClick={() => this.props.history.goBack()}>
                <i class="fas fa-arrow-left"/>
              </Button>
              {User.can_create_article ? 
                <Button onClick={() => this.props.history.push('/articles/new/article')}>
                Create
                </Button>
                : null}
            </Col>
            <Col md={8} xs={12} className="ActionToolbar" componentClass={InputGroup}>
              <InputGroup.Addon>
                <FormControl name="filter" componentClass="select" onChange={this.onChange}>
                  <option value=" ">TAGS</option>
                  <option value="article">article</option>
                  <option value="newsletter">newsletter</option>
                </FormControl>
              </InputGroup.Addon>
              <FormControl type="text" name="search" placeholder="Search..." onChange={this.onChange} />
            </Col>
        </Row>
        <Row>
          <h3>Highlights</h3>
          {/* Articles.length ? this.renderCards(Articles) : null */}
        </Row>
        <Row>
          <h3>Recent</h3>
          {Articles.length ? this.renderCards(Articles.sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified))) : null}
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Articles))
