import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Tabs, Tab, ButtonToolbar, Button, FormGroup, InputGroup} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import {getArticles, getArticle, deleteArticle} from '../../actions/Articles'
import {getNewsletters, getNewsLetter, deleteNewsLetter} from '../../actions/NewsLetter'
import Card from '../../components/Card'
import {withRouter} from 'react-router-dom'
import Select from 'react-select'
import {selectStyles} from '../../helpers/styles'

const mapStateToProps = ({User, Articles, Newsletters}) => ({
  User,
  Articles,
  Newsletters
})

const mapDispatchToProps = {
  getArticle,
  getArticles,
  deleteArticle,
  getNewsletters,
  getNewsLetter,
  deleteNewsLetter
}

class News extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      selectValue: null,
      Documents: []
    }
  }

  static propTypes = { 
    getNewsletters: PropTypes.func.isRequired
  }

  static defaultProps = {
    selectOptions: [
      {value: 'Official', label: 'Official'},
      {value: 'Article', label: 'Article'},
      {value: 'Newsletter', label: 'Newsletter'},
      {value: 'Blog', label: 'Blog'},
      {value: 'FanMade', label: 'FanMade'},
      {value: 'Guide', label: 'Guide'},
      {value: 'Lore', label: 'Lore'},
      {value: 'Other', label: 'Other'},
    ],
    Documents: []
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {Articles, Newsletters} = nextProps
    const {Documents, selectValue} = nextState
    return Documents.length != (Articles.length + Newsletters.length) || selectValue
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    this.props.getArticles()
    this.props.getNewsletters()
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User, Articles, Newsletters} = props
    const Documents = Articles.concat(Newsletters)
    const selectOptions = Documents.length > 1 ? Documents.map(i => i.tags)[0].split('|').map(i => i = {value: i, label: i}) : this.props.selectOptions
    this.setState({User, Documents, selectOptions})
  }

  //Filter the Documents if the documents tags array contains the filter array
  renderCards = (Documents, filter) => Documents.filter(doc => doc.tags.split('|').every(r => filter.length > 0 ? filter.includes(r) : r))
  .sort((a,b) => new Date(b.last_modified) - new Date(a.last_modified))
  .map(card => {
    const {history} = this.props
    let click = null
    let editCard = null
    let deleteCard = null
    let className = "CardContainer "
    if (card.tags.includes('Article')) {
      click = () => history.push('/articles/' + card.id)
      editCard = () => {history.push('/articles/edit/article/' + card.id); this.props.getArticle(card.id)}
      deleteCard = this.props.deleteArticle
      className += "CardContainerArticle"
    }
    if(card.tags.includes('Newsletter')){
      click = () => history.push('/newsletters/' + card.id)
      editCard = () => {history.push('/articles/edit/newsletter/' + card.id); this.props.getNewsLetter(card.id)}
      deleteCard = this.props.deleteNewsLetter
      className += "CardContainerNewsletter"
    }
    return <Col className={className} md={3} xs={12}><Card {...card} click={() => history.push('/articles/' + card.id)} editCard={editCard} deleteCard={deleteCard} summary={true}/></Col>
  })

  onChange = e => {
    const query = e.target.value.toLowerCase()
    const Newsletters = this.props.Newsletters.filter(newsletter => {
      const title = newsletter.title ? newsletter.title.toLowerCase() : ' '
      const tags = newsletter.tags ? newsletter.tags.toLowerCase() : ' '
      if(title.includes(query) || tags.includes(query)) return true
      return false
    })
    this.setState({Newsletters, [e.target.name]: e.target.value})
}

  onSelectChange = (selectValue, {action, removedValue}) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
        if (removedValue.isFixed) {
          return
        }
        break
      case 'clear':
      selectValue = this.props.selectOptions.filter((v) => v.isFixed)
        break
    }

    this.setState({selectValue})
  }

  render() {
    console.log("RENDER NEWS")
    const selectValue = this.state.selectValue ? this.state.selectValue : this.props.selectOptions
    const {User, Documents} = this.state
    const filter = selectValue.map(i => i.value)
    return (
      Documents ?
      <Grid className="News Container fadeIn-2">
        <Row>
          <PageHeader className="pageHeader">NEWS</PageHeader>
        </Row>
        <Row>
          <Col md={3} xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
            {User.is_superuser || User.can_create_article ? <Button onClick={() => this.props.history.push('/articles/new/article')}><i class="fas fa-plus"/> Article</Button> : null}
            {User.is_superuser || User.can_create_newsletter ? <Button onClick={() => this.props.history.push('/articles/new/newsletter')}><i class="fas fa-plus"/> Newsletter</Button> : null}
          </Col>
          <Col md={5} xs={12}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon><i class="fas fa-tags"/></InputGroup.Addon>
                <Select
                //https://react-select.com/props
                  value={this.state.selectValue}
                  isMulti
                  styles={selectStyles}
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                  isSearchable={false}
                  name="colors"
                  className="FilterMultiSelect"
                  classNamePrefix="select"
                  onChange={this.onSelectChange}
                  options={this.props.selectOptions}
              />
             </InputGroup>
            </FormGroup>
          </Col>
          <Col md={4} xs={12}>
          </Col>
        </Row>
        <Row>
          <Tabs defaultActiveKey={1} className="Tabs" animation={false}>
            <Tab eventKey={1} title="LATEST" className="fadeIn-2" unmountOnExit={true}>
              <Row>
                {Documents.length ? this.renderCards(Documents, filter) : null}
              </Row>
            </Tab>
            <Tab eventKey={2} title="SUGGESTED" className="fadeIn-2" unmountOnExit={true}>
              Suggested
            </Tab>
          </Tabs>
        </Row>
      </Grid>
      : null
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(News))