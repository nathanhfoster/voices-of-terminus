import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, FormGroup, FormControl, ButtonToolbar, Button} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import {setEditorState} from '../../actions/TextEditor'
import {Map} from 'immutable'
import {isEmpty} from '../../helpers/helpers'

const mapStateToProps = ({editorState}) => ({
  editorState
})

const mapDispatchToProps = {
  setEditorState
}

class TextEditor extends Component {
  constructor(props) {
    super(props)
    this.onEditorStateChange = this.onEditorStateChange.bind(this)

    this.state = {
      editorState: EditorState.createEmpty(),
      show: false
    }
  }

  static propTypes = {
    editorState: new Map()
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
    // Set the editorState from Redux if it exists else set an initial value
    const editorState = props.editorState.hasOwnProperty('_immutable') ? props.editorState : EditorState.createEmpty()
    this.setState({
        editorState
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  onEditorStateChange = editorState => {
    this.props.setEditorState(editorState)
  }

  render() {
    const { editorState } = this.state
    return (
      <Grid className="TextEditor">
        <Row>
          <Col sm={12}>
            <ButtonToolbar>
              <Button onClick={this.handleShow} className="newArticleButton">
                New Article
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row>
        <Col sm={12}>
          <form>
            <FormGroup className="editorForm">
              <FormControl type="text" placeholder="Title" />
            </FormGroup>
            <FormGroup className="editorForm">
              <FormControl type="text" placeholder="Category" />
            </FormGroup>
          </form>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Editor
            wrapperClassName="Wrapper"
            editorClassName="Editor"
            toolbarClassName="Toolbar"
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
              />
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <textarea
            className="TextEditorOutput"
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          />
        </Col>
      </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TextEditor)