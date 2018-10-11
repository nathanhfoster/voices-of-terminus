import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, Form, FormGroup, FormControl, ButtonToolbar, Button} from 'react-bootstrap'
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

const mapStateToProps = ({editorState, HtmlDocument, User}) => ({
  editorState,
  HtmlDocument,
  User,
})

const mapDispatchToProps = {
  postDocument,
  clearHtmlDocument,
  setEditorState,
  updateArticle
}

class TextEditor extends Component {
  constructor(props) {
    super(props)
    this.onEditorStateChange = this.onEditorStateChange.bind(this)

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
      show: false
    }
  }

  static propTypes = {
    editorState: PropTypes.func.isRequired
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
    let {editorState} = props
    const {User, HtmlDocument, match} = props
    const {author, tags, title} = HtmlDocument
    const {id} = match ? match.params : null
    
    // Set the editorState from Redux if it exists else create an empty state
    if(HtmlDocument.hasOwnProperty('html')) {
      const blocksFromHtml = htmlToDraft(HtmlDocument.html)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      editorState = EditorState.createWithContent(contentState)
    } else editorState = EditorState.createEmpty()

    this.setState({User, HtmlDocument, id, author, tags, title, editorState})
  }

  componentWillUnmount() {
    const {editorState} = this.state
    this.props.clearHtmlDocument()
    this.props.setEditorState(editorState)
  }

  onEditorStateChange = editorState => {
    this.setState({editorState})
  }
  postArticle = () => {
    const {editorState, title, User} = this.state
    let {tags} = this.state
    tags = 'article ' + tags
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    this.props.postDocument({title, slug: 'doc', author: User.id, html, tags, last_modified_by: User.id})
   }

   updateArticle = (id) => {
     const {author, tags, title, editorState} = this.state
     const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
     this.props.updateArticle(id, {author, html, tags, title})
    }

    onChange = event => {
      event.target.name === 'title' ? this.setState({title: event.target.value})
      : event.target.name === 'tags' ? this.setState({tags: event.target.value}) : null
    }

  render() {
    const {User, id, author, tags, title, editorState, HtmlDocument} = this.state
    
    return (
      !User.token ? <Redirect to="/login"/>
      :<Grid className="TextEditor Container fadeIn-2">
        <Row>
          <Col md={6} xs={6} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button type="submit" onClick={() => this.updateArticle(id)} disabled={!id}>
              Update
            </Button>
          </Col>
          <Col md={6} xs={6} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button type="submit" onClick={this.postArticle} className="pull-right">
              Post
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} style={{padding: '0'}}>
            <Form>
              <FormGroup>
                <FormControl value={title} type="text" placeholder="Title" name="title" onChange={this.onChange.bind(this)}/>
              </FormGroup>
              <FormGroup>
                <FormControl value={tags} type="text" placeholder="Tags" name="tags" onChange={this.onChange.bind(this)}/>
              </FormGroup>
            </Form>
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
              stripPastedStyles="off"
              spellCheck="off"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
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
