import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader,ButtonToolbar, Button } from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import Card from '../../components/Card'
import {getArticles} from '../../actions/Articles'
import { Map, List} from 'immutable'
import {withRouter} from 'react-router-dom'
import {deleteArticle} from '../../actions/Articles'

const mapStateToProps = ({Articles, User}) => ({
  Articles,
  User
})

const mapDispatchToProps = {
  getArticles,
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
    Articles: new List(),
    getArticles: PropTypes.func.isRequired
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.props.getArticles()
    this.getState(this.props)
  }

  componentDidMount() {
    
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Articles, User} = props
    this.setState({
      Articles,
      User
    })
  }

  renderCards = (Articles) => Articles.map(card => {
    return (
      <Col className="CardContainer" md={3}>
        <Card {...card} deleteItem={this.props.deleteArticle}/>
      </Col>
    )
  })

  render() {
    const {Articles, User} = this.state
    return (
      <Grid className="Articles Container">
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

        <Row>
            <PageHeader className="pageHeader">ARTICLES</PageHeader>
        </Row>

        <Row>
          <Col sm={12}>
            <h3>Highlights</h3>
          </Col>
        </Row>
        <Row>
          
        </Row>
          {Articles.length ? this.renderCards(Articles) : null}
        <Row>
          <Col sm={12}>
            <h3>Recent</h3>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Articles))