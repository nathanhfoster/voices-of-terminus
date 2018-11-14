import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Tabs, Tab, ButtonToolbar, Button, FormGroup, InputGroup, FormControl} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import {clearHtmlDocument} from '../../actions/App'
import {getArticles, getArticle, deleteArticle} from '../../actions/Articles'
import {getNewsletters, getNewsLetter, deleteNewsLetter} from '../../actions/NewsLetter'
import Card from '../../components/Card'
import {withRouter} from 'react-router-dom'
import Select from 'react-select'
import {selectStyles} from '../../helpers/styles'
import {hasUpdatePermission, hasDeletePermission, isSubset} from '../../helpers'
import matchSorter from 'match-sorter'

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
  deleteNewsLetter,
  clearHtmlDocument
}

class News extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectValue: null,
      Documents: [],
      search: ''
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
    const {Documents, selectValue, search} = nextState
    const initialLoad = Documents.length === 0
    const cardAdded = Documents.length > (Articles.length + Newsletters.length)
    const cardDeleted = Documents.length < (Articles.length + Newsletters.length)
    const cardUpdated = true
    // console.log("nextProps: ", nextProps)
    // console.log("nextState: ", nextState)
    // console.log("this.state: ", this.state)
    return initialLoad || cardAdded || cardDeleted || selectValue || search || search === undefined
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

  componentWillUnmount(){
    this.props.clearHtmlDocument()
  }

  getState = props => {
    const {User, Articles, Newsletters} = props
    const Documents = Articles.concat(Newsletters)
    const selectOptions = Documents.length > 1 ? Documents.map(i => i.tags)[0].split('|').map(i => i = {value: i, label: i}) : this.props.selectOptions
    this.setState({User, Articles, Newsletters, Documents, selectOptions})
  }

  //Filter the Documents if the documents tags array contains the filter array
  renderCards = (Documents, filter, n, m) => Documents.filter(doc => filter.length == m || filter.length == n ? doc : isSubset(doc.tags.split('|'), filter))
  .sort((a,b) => new Date(b.last_modified) - new Date(a.last_modified))
  .map(card => {
    const {User, history} = this.props
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
    return (
      <Col className={className} md={3} xs={12}>
        <Card
        {...card} User={User}
        canDelete={hasDeletePermission(User, card.author, card.tags)}
        canUpdate={hasUpdatePermission(User, card.author, card.tags)}
        click={click} editCard={editCard} deleteCard={deleteCard} summary={true}/>
      </Col>)
  })

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

  onChange = (filter, Documents) => {
    const {name, value} = filter.target
    this.setState({[name]: value ? value : undefined})
  }

  render() {
    console.log('NEWS')
    const selectValue = this.state.selectValue ? this.state.selectValue : this.props.selectOptions
    const {User, search} = this.state
    const {length} = this.props.selectOptions
    let {Documents} = this.state
    Documents = search ? matchSorter(Documents, search, {keys: ['title', 'author_username', 'last_modified_by_username']}) : Documents
    const filter = selectValue.map(i => i.value)
    return (
      Documents ?
      <Grid className="News Container fadeIn-2">
        <Row>
          <PageHeader className="pageHeader">NEWS</PageHeader>
        </Row>
        <Row>
          <Col md={3} xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button disabled={!(User.is_superuser || User.can_create_article)} onClick={() => this.props.history.push('/articles/new/article')}><i class="fas fa-plus"/> Article</Button>
            <Button disabled={!(User.is_superuser || User.can_create_newsletter)} onClick={() => this.props.history.push('/articles/new/newsletter')}><i class="fas fa-plus"/> Newsletter</Button>
          </Col>
          <Col md={5} xs={12}>
            <InputGroup>
              <InputGroup.Addon><i class="fas fa-search"/></InputGroup.Addon>
              <FormControl style={{fontSize: 'medium'}} type="text" name="search" placeholder="Filter by Title and Author..."  value={search} onChange={(filter) => this.onChange(filter, Documents)}/>
            </InputGroup>
          </Col>
          <Col md={4} xs={12}>
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
                placeholder="Filter by tags..."
                className="FilterMultiSelect"
                classNamePrefix="select"
                onChange={this.onSelectChange}
                options={this.props.selectOptions}
            />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Tabs defaultActiveKey={1} className="Tabs" animation={false}>
            <Tab eventKey={1} title="LATEST" className="fadeIn-2" unmountOnExit={true}>
              <Row>
                {Documents.length ? this.renderCards(Documents, filter, 0, length) : null}
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
