import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, FormGroup, InputGroup, FormControl, ButtonToolbar, Button} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import {setEditorState} from '../../actions/TextEditor'
import {clearHtmlDocument} from '../../actions/App'
import {postDocument, updateArticle} from '../../actions/Articles'
import {withRouter, Redirect} from 'react-router-dom'
import Select from 'react-select'
import {selectStyles} from '../../helpers/styles'

const mapStateToProps = ({editorState, HtmlDocument, User}) => ({
  editorState,
  HtmlDocument,
  User,
})

const mapDispatchToProps = {
  postDocument,
  setEditorState,
  updateArticle,
  clearHtmlDocument
}

class TextEditor extends PureComponent {
  constructor(props) {
    super(props)
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)

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
      title: '',

      editorState: null,
      show: false,
      selectValue: null
    }
  }

  static propTypes = {
    editorState: PropTypes.func.isRequired
  }

  static defaultProps = {
    selectOptions: [
      {value: 'Article', label: 'Article', isFixed: true },
      {value: 'Official', label: 'Official'},
      {value: 'Blog', label: 'Blog'},
      {value: 'FanMade', label: 'FanMade'},
      {value: 'Guide', label: 'Guide'},
      {value: 'Lore', label: 'Lore'},
      {value: 'Other', label: 'Other'},
    ]
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
    let {selectOptions, editorState} = props
    const {User, HtmlDocument, match} = props
    const Leader = User.is_leader || User.is_council
    selectOptions[1].isDisabled = !(User.is_leader || User.is_council)
    const {author, title} = HtmlDocument ? HtmlDocument : ''
    const tags =  HtmlDocument ? HtmlDocument.tags.split('|').filter(i => i != 'Article').map(i => i = {value: i, label: i}) : []
    const selectValue = [selectOptions[0], ...tags]
    const {id} = match ? match.params : null
    
    // Set the editorState from Redux if it exists else create an empty state
    if(HtmlDocument) {
      const blocksFromHtml = htmlToDraft(HtmlDocument.html)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      editorState = EditorState.createWithContent(contentState)
    } else editorState = EditorState.createEmpty()

    this.setState({User, HtmlDocument, id, author, tags, title, editorState, selectValue: this.orderOptions(selectValue)})
  }

  componentWillUnmount() {
    const {editorState} = this.state
    this.props.setEditorState(editorState)
    this.props.clearHtmlDocument()
  }

  onEditorStateChange = editorState => {
    this.setState({editorState})
  }
  
  postArticle = () => {
    const {editorState, title, User, selectValue} = this.state
    let {tags} = this.state
    tags = tags.length < 1 ? selectValue[0].value : tags
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    this.props.postDocument(User.token, {title, slug: 'doc', author: User.id, html, tags, last_modified_by: User.id})
   }

   updateArticle = (id) => {
     const {author, tags, title, editorState, User} = this.state
     const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
     this.props.updateArticle(id, User.token, {last_modified_by: User.id, html, tags, title})
    }

    onChange = e => this.setState({[e.target.name]: e.target.value})

    orderOptions = values => values.filter((v) => v.isFixed).concat(values.filter((v) => !v.isFixed))

    onSelectChange (selectValue, { action, removedValue }) {
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
      selectValue = this.orderOptions(selectValue)
      const tags = selectValue.map(i => i.value).join('|')
      this.setState({ selectValue, tags })
    }

  render() {
    const {User, id, author, tags, title, editorState, HtmlDocument, selectValue} = this.state
    
    return (
      !User.token ? <Redirect to="/login"/>
      :<Grid className="TextEditor Container fadeIn-2">
        <Row>
          <Col md={6} xs={6} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button disabled={!selectValue[0].value} type="submit" onClick={this.postArticle}>Post</Button>
            <Button type="submit" onClick={() => this.updateArticle(id)} disabled={!id}>Update</Button>
          </Col>
          <Col md={6} xs={6} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button type="submit" onClick={() => this.setState({editorState: EditorState.createEmpty(), title: '', tags: ''})} className="pull-right">Clear</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon><i class="fas fa-heading"></i></InputGroup.Addon>
                <FormControl value={title} type="text" placeholder="Title" name="title" onChange={this.onChange.bind(this)}/>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col>
          <FormGroup>
            <InputGroup>
              <InputGroup.Addon><i class="fas fa-tag"/></InputGroup.Addon>
              <Select
              value={this.state.selectValue}
              isMulti
              styles={selectStyles}
              isClearable={true}
              isSearchable={false}
              onBlur={e => e.preventDefault()}
              blurInputOnSelect={false}
              // isClearable={this.state.value.some(v => !v.isFixed)}
              name="colors"
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={this.onSelectChange}
              options={this.props.selectOptions}
              />
            </InputGroup>
          </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Editor
              wrapperClassName="Wrapper"
              editorClassName="Editor"
              toolbarClassName="Toolbar"
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
              onBlur={e => e.preventDefault()}
              blurInputOnSelect={false}
              // stripPastedStyles="off"
              // spellCheck="off"
              // autoCapitalize="off"
              // autoComplete="off"
              // autoCorrect="off"
                />
          </Col>
        </Row>
        {/* <Row>
          <Col sm={12}>
            <textarea
            style={{height: '500px', width: '100%'}}
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            />
          </Col>
        </Row> */}
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(TextEditor))
