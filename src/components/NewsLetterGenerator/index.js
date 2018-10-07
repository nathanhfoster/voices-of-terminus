import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, ButtonToolbar, Button, Modal, Form} from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import EmailEditor from 'react-email-editor'
import {createNewsletter, getNewsLetter, clearNewsLetter, updateNewsLetter} from '../../actions/NewsLetter'
import {withRouter} from 'react-router-dom'
import defaultDesign from './defaultDesign.json'

const mapStateToProps = ({Newsletters, HtmlDocument, User}) => ({
  Newsletters,
  HtmlDocument,
  User
})

const mapDispatchToProps = {
  getNewsLetter,
  updateNewsLetter,
  clearNewsLetter
}

class NewsLetterGenerator extends Component {
  constructor(props) {
    super(props)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
 
    this.state = {
      show: false
    }
  }

  static propTypes = {
  }

  static defaultProps = {
   
  }
  
  componentWillMount() {
    if(this.props.match) {
      this.props.getNewsLetter(this.props.match.params.id)
    }
    this.getState(this.props)
  }

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User, Newsletters, HtmlDocument} = props
    this.setState({Newsletters, HtmlDocument, User})
  }

  componentWillUnmount(){
    this.props.clearNewsLetter()
    this.setState({HtmlDocument: null})
  }

  exportHtml = () => {
    const {User} = this.state
    this.editor.exportHtml(data => {
      let { design, html } = data
      design = JSON.stringify(design)
      createNewsletter({title: 'Test', slug:"news", author: User.id, html, design, last_modified_by: User.id})
    })
  }

  loadDesign = design => this.editor.loadDesign(design)

  onDesignLoad = data => {
   console.log('onDesignLoad', data)
   //this.editor.setMergeTags([{name: 'First Name'}])
  }

  saveDesign = () => {
    const {id} = this.props.match.params
    this.editor.saveDesign(design => {
      // design = JSON.stringify(design)
      const title = "CHANGED"
      this.props.updateNewsLetter(id, {design, title})
    })
  }

  renderDesigns = () => {
    
  }

  handleShow = () => this.setState({show: true})
  
  handleHide = () => this.setState({show: false})

  isEditingDesign = (hasUrlParams, design, editorLoaded) => {

  }
  
  render() {
    const design = this.state.HtmlDocument.hasOwnProperty('design') ? JSON.parse(this.state.HtmlDocument.design) : null
    // True if there are paramaters in the url, redux updated the state in getstate(), and if the editor has loaded into memory
    const isEditingDesign = this.props.match && design && this.editor && window.unlayer
   
    const styles = {
      boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.25)',
      maxWidth: '50px !important'
    }
      
    return (
      <Grid className="NewsLetterGenerator Container">
        <Row>
          <ButtonToolbar className="ButtonToolbar">
            <Button onClick={() => this.loadDesign(defaultDesign)}>NEW</Button>
            <Button onClick={this.exportHtml}>POST</Button>
            <Button onClick={this.saveDesign}>SAVE</Button>
            <Button onClick={this.saveDesign}>UPDATE</Button>
            <Button onClick={this.handleShow}>LOAD</Button>
          </ButtonToolbar>
        </Row>
        <Row>
          <EmailEditor minHeight="85vh" ref={editor => this.editor = editor} style={styles} onLoad={isEditingDesign ? this.loadDesign(design) : null}/>
        </Row> 
        <Row>
          <Modal
            {...this.props}
            show={this.state.show}
            onHide={this.handleHide}
            dialogClassName="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">
                Load Design
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className="Container">
                <Row>

                </Row>
              </Form>
            </Modal.Body>
          </Modal>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(NewsLetterGenerator))