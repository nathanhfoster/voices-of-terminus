import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Tabs, Tab, ButtonToolbar, Button, FormGroup, InputGroup, FormControl} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import {clearHtmlDocument} from '../../actions/App'
import {getArticles, getArticle, deleteArticle} from '../../actions/Articles'
import {getNewsletters, getNewsletter, deleteNewsLetter} from '../../actions/NewsLetter'
import Card from '../../components/Card'
import {withRouter} from 'react-router-dom'
import Select from 'react-select'
import {selectStyles} from '../../helpers/styles'
import {hasUpdatePermission, hasDeletePermission, isSubset, isEquivalent} from '../../helpers'
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
  getNewsletter,
  deleteNewsLetter,
  clearHtmlDocument
}

class News extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectValue: [],
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
      {value: 'VotShow', label: 'VotShow'},
      {value: 'Other', label: 'Other'},
    ],
    Documents: []
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const {Articles, Newsletters} = this.state
  //   const {User, Documents, selectValue, search, history} = nextState
  //   const {pathname} = history.location

  //   const currentPathName = this.state.eventKey
  //   const currentUser = this.state.User
  //   const currentDocuments = Articles.concat(Newsletters)
  //   const currentSelectValue = this.state.selectValue
  //   const currentSearch = this.state.search
    
  //   const pathChanged = pathname != currentPathName
  //   const initialLoad = Documents.length === 0
  //   const userChanged = !isEquivalent(currentUser, User)
  //   const cardAdded = Documents.length > currentDocuments.length
  //   const cardDeleted = Documents.length < currentDocuments.length
  //   const cardUpdated = !isSubset(Documents.map(k => k.last_modified), currentDocuments.map(k => k.last_modified)) || !isSubset(Documents.map(k => k.views), currentDocuments.map(k => k.views)) || !isSubset(Documents.map(k => k.likeCount), currentDocuments.map(k => k.likeCount)) || !isSubset(Documents.map(k => k.commentCount), currentDocuments.map(k => k.commentCount))
  //   const isFiltering = selectValue != currentSelectValue
  //   const isSearching = search != currentSearch
  //   // search === undefined
  //   // console.log("nextProps: ", nextProps)
  //   // console.log("nextState: ", nextState)
  //   // console.log("this.state: ", this.state)
  //   return pathChanged || initialLoad || cardAdded || cardDeleted || cardUpdated || isFiltering || isSearching || userChanged
  // }
  
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
    const {User, Articles, Newsletters, history} = props
    const {pathname} = history.location
    const Documents = Articles.concat(Newsletters)
    const selectOptions = Documents.length > 1 ? Documents.map(i => i.tags)[0].split('|').map(i => i = {value: i, label: i}) : this.props.selectOptions
    this.setState({User, Articles, Newsletters, Documents, selectOptions, eventKey: pathname, history})
  }

  //Filter the Documents if the documents tags array contains the filter array
  renderCards = (Documents, filter, dontFilter, sort, tabFilter) => Documents
  .filter(doc => dontFilter ? doc : isSubset(doc.tags.split('|'), filter))
  .filter(tabFilter)
  .sort(sort)
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
      editCard = () => {history.push('/articles/edit/newsletter/' + card.id); this.props.getNewsletter(card.id)}
      deleteCard = this.props.deleteNewsLetter
      className += "CardContainerNewsletter"
    }
    return (
      <Col className={className} md={3} sm={6} xs={12}>
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
    //console.log('NEWS: ')
    const {eventKey, history} = this.state
    const selectValue = this.state.selectValue.length > 0 ? this.state.selectValue : this.props.selectOptions
    const {User, search} = this.state
    let {Documents} = this.state
    Documents = search ? matchSorter(Documents, search, {keys: ['title', 'author_username', 'last_modified_by_username']}) : Documents
    const filter = selectValue.map(i => i.value)
    const maxlength = this.props.selectOptions.length
    const dontFilter = filter.length == maxlength || filter.length == 0
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
              <FormControl style={{fontSize: 'medium'}} type="text" name="search" placeholder="Filter by Title or Author..."  value={search} onChange={filter => this.onChange(filter, Documents)}/>
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
          <Tabs defaultActiveKey={eventKey} activeKey={eventKey} className="Tabs" onSelect={eventKey => {this.setState({eventKey}); history.push(eventKey)}} animation={false}>
            <Tab eventKey="/news/latest" title="LATEST" className="fadeIn-2" unmountOnExit={true}>
              <Row>
                {Documents.length ? this.renderCards(Documents, filter, dontFilter, (a, b) => new Date(b.last_modified) - new Date(a.last_modified), doc => doc) : null}
              </Row>
            </Tab>
            <Tab eventKey="/news/suggested" title="SUGGESTED" className="fadeIn-2" unmountOnExit={true}>
              <Row>
                {Documents.length ? this.renderCards(Documents, filter, dontFilter, (a, b) => a.views - b.views, doc => doc) : null}
              </Row>
            </Tab>
            <Tab eventKey="/news/popular" title="POPULAR" className="fadeIn-2" unmountOnExit={true}>
              <Row>
                {Documents.length ? this.renderCards(Documents, filter, dontFilter, (a, b) => (b.views + b.likeCount + b.commentCount) - (a.views + a.likeCount + a.commentCount), doc => doc) : null}
              </Row>
            </Tab>
            {User.token ?
            <Tab eventKey="/news/my-docs" title="MY DOCS" className="fadeIn-2" unmountOnExit={true}>
              <Row>
                {Documents.length ? this.renderCards(Documents, filter, dontFilter, (a, b) => new Date(b.last_modified) - new Date(a.last_modified), doc => doc.author === this.state.User.id) : null}
              </Row>
            </Tab>
            : null} 
          </Tabs>
        </Row>
      </Grid>
      : null
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(News))
