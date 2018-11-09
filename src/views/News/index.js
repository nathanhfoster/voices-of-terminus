import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Tabs, Tab, ButtonToolbar, Button, FormGroup, InputGroup, FormControl} from 'react-bootstrap'
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
    this.onSelectChange = this.onSelectChange.bind(this)
    this.state = {
      selectValue: null
    }
  }

  static propTypes = { 
    getNewsletters: PropTypes.func.isRequired
  }

  static defaultProps = {
    selectOptions: [
      { value: 'Newsletter', label: 'Newsletter' },
      { value: 'Lore', label: 'Lore' },
      { value: 'Blog', label: 'Blog' },
      { value: 'FanMade', label: 'FanMade' },
    ]
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

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderCards = Documents => Documents.sort((a,b) => new Date(b.last_modified) - new Date(a.last_modified)).map(card => {
    let click = null
    let editCard = null
    let deleteCard = null
    if (card.tags.includes('Article')) {
      click = () => {this.props.getArticle(card.id); this.props.history.push('/articles/' + card.id)}
      editCard = () => {this.props.getArticle(card.id); this.props.history.push('/articles/edit/article/' + card.id)}
      deleteCard = this.props.deleteArticle
    }
    if(card.tags.includes('Newsletter')){
      click = () => {this.props.getNewsLetter(card.id); this.props.history.push('/newsletters/' + card.id)}
      editCard = () => {this.props.getNewsLetter(card.id); this.props.history.push('/articles/edit/newsletter/' + card.id)}
      deleteCard = this.props.deleteNewsLetter
    }
    return <Col className="CardContainer" md={3}><Card {...card} click={click} editCard={editCard} deleteCard={deleteCard} summary={true}/></Col>
  })

  onChange = (e) => {
    const query = e.target.value.toLowerCase()
    const Newsletters = this.props.Newsletters.filter(newsletter => {
      const title = newsletter.title ? newsletter.title.toLowerCase() : ' '
      const tags = newsletter.tags ? newsletter.tags.toLowerCase() : ' '
      if(title.includes(query) || tags.includes(query)) return true
      return false
    })
    this.setState({Newsletters, [e.target.name]: e.target.value})
}

  onSelectChange (selectValue, {action, removedValue}) {
    const {Articles, Newsletters} = this.props
    let {Documents} = this.state
    const filter = new RegExp(selectValue.map(i => i.value).join('|'))
    console.log(filter.test('?'))
    Documents = !filter.test('?') ? Documents.filter(i => i.tags.match(filter)) : Articles.concat(Newsletters)
    console.log(Documents)
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

    this.setState({selectValue, Documents})
  }

  render() {
    const {User, Documents} = this.state
    return (
      <Grid className="News Container fadeIn-2">
        <Row>
          <PageHeader className="pageHeader">NEWS</PageHeader>
        </Row>
        <Row>
          <Col md={4} xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button onClick={() => this.props.history.goBack()}><i class="fas fa-arrow-left"/></Button>
            {User.is_superuser || User.can_create_article ? <Button onClick={() => this.props.history.push('/articles/new/article')}>Create Article</Button> : null}
            {User.is_superuser || User.can_crate_newsletter ? <Button onClick={() => this.props.history.push('/articles/new/newsletter')}>Create Newsletter</Button> : null}
          </Col>
          <Col md={8} xs={12}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon><i class="fas fa-search"/></InputGroup.Addon>
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
        </Row>
        <Row>
          <Tabs defaultActiveKey={1} className="Tabs" animation={false}>
            <Tab eventKey={1} title="LATEST" className="fadeIn-2" unmountOnExit={true}>
              <Row>
                {Documents.length ? this.renderCards(Documents) : null}
              </Row>
            </Tab>
            <Tab eventKey={2} title="SUGGESTED" className="fadeIn-2" unmountOnExit={true}>
              Suggested
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(News))
