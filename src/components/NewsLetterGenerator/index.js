import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, ButtonToolbar, Button, Modal, Form, FormGroup, FormControl} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import EmailEditor from 'react-email-editor'
import {postNewsletter, getNewsletters, getNewsLetter, deleteNewsLetter, updateNewsLetter} from '../../actions/NewsLetter'
import {withRouter, Redirect} from 'react-router-dom'
import defaultDesign from './defaultDesign.json'
import Card from '../Card'

const mapStateToProps = ({Newsletters, HtmlDocument, User}) => ({
  Newsletters,
  HtmlDocument,
  User
})

const mapDispatchToProps = {
  postNewsletter,
  getNewsletters,
  getNewsLetter,
  deleteNewsLetter,
  updateNewsLetter
}

class NewsLetterGenerator extends Component {
  constructor(props) {
    super(props)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
 
    this.state = {
      show: false,
      User: null,
      Newsletters: null, 
      HtmlDocument: null, 
      author: null, 
      tags: null, 
      title: null, 
      id: null,
      loadOnce: true
    }
  }

  static propTypes = {
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
    const {User, Newsletters, HtmlDocument} = props
    const {author, tags, title} = HtmlDocument
    const {id} = props.match.params
    this.setState({User, Newsletters, HtmlDocument, author, tags, title, id})
  }

  componentWillUnmount() {
    this.setState({HtmlDocument: null})
  }

  postNewsletter = () => {
    const {User, title} = this.state
    let {tags} = this.state
    tags = tags ? tags : 'newsletter'
    this.editor.exportHtml(data => {
      let { design, html } = data
      design = JSON.stringify(design)
      this.props.postNewsletter(User.token, {title, slug:"news", author: User.id, tags, html, design, last_modified_by: User.id})
    })
  }

  loadNewsletterDesign = design => this.editor.loadDesign(design)

  onDesignLoad = design => {
    console.log('ONDEIGNKOAD')
    //this.editor.setMergeTags([{name: 'First Name'}])

    // Custom Image Storage in Base64
    window.unlayer.registerCallback('image', (file, done) => {
      const image = file.attachments[0]
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onloadend = () => done({ progress: 100, url: reader.result })
    })
  }

  updateNewsletter = () => {
    const {title, tags, id, User} = this.state
    this.editor.exportHtml(data => {
      let {design, html} = data
      design = JSON.stringify(design)
      this.props.updateNewsLetter(id, User.token, {title, tags, design, html})
    })
  }

  renderDesigns = Newsletters => Newsletters.sort((a,b) => new Date(b.date_created) - new Date(a.date_created)).map(card => {
    return (
      <Col className="NewsletterCardContainer" md={6} >
        <Card {...card} summary={false} deleteCard={this.props.deleteNewsLetter} editCard={this.props.getNewsLetter} click={() => this.handleHide(card.id)} />
      </Col>
    )
  })

  handleShow = () => {
    this.props.getNewsletters()
    this.setState({show: true})
  }

  // Call back function passed into <Card> as a prop
  handleHide = id => {
    if(id) {
      this.props.getNewsLetter(id)
      this.props.history.push("/articles/edit/newsletter/" + id)
    }
    this.setState({show: false})
  }

  onChange = event => {
    event.target.name === 'title' ? this.setState({title: event.target.value})
    : event.target.name === 'tags' ? this.setState({tags: event.target.value}) : null
  }
  
  render() {
    const {User, Newsletters, HtmlDocument, author, tags, title, id} = this.state
    // Set {id} = HtmlDocument if loaded from redux else set {id} = match.params from the url
    // Set {design} = JSON.parse(HtmlDocument.design) if loaded from redux else set {design} = null because you are not editing an existing one
    const design = HtmlDocument.design ? JSON.parse(HtmlDocument.design) : null
    // True if there are paramaters in the url, redux updated the state in getstate(), and if the editor has loaded into memory
    const isEditingDesign = id && design && this.editor && window.unlayer
   
    const styles = {
      boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.25)'
    } 
    return (
      !User.token ? <Redirect to={this.props.history.push("/login")}/>
      :<Grid className="NewsLetterGenerator Container fadeIn-2">
        <Row>
          <Col md={6} xs={6} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button onClick={this.postNewsletter}>POST</Button>
            <Button onClick={this.updateNewsletter} disabled={!isEditingDesign}>UPDATE</Button>
         </Col>
          <Col md={6} xs={6} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button onClick={this.handleShow} className="pull-right">LOAD</Button>
            <Button onClick={this.updateNewsletter} className="pull-right" disabled>SAVE</Button>
            <Button onClick={() => this.loadNewsletterDesign(defaultDesign)} className="pull-right">CLEAR</Button>
          </Col>
        </Row>
        <Row>
          <Col>
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
          <EmailEditor 
            id = 'editor'
            projectId = '1558'
            templateId = "UVUlFBYAZkRx58DwbDkC3BU4JrEmCW9AN8flo4vYtEAg9h1ULftKMXpu2UIEGDZs"
            minHeight = "calc(100vh - 58px)"
            ref={editor => this.editor = editor}
            style={styles} 
            onDesignLoad = {this.onDesignLoad}
            onLoad={isEditingDesign ? this.loadNewsletterDesign(design) : null}
            onChange = {(e) => console.log("ONCHANGE", e)}
          />
        </Row> 
        <Row>
          <Modal
            backdrop={false}
            {...this.props}
            show={this.state.show}
            onHide={() => this.handleHide(id)}
            dialogClassName="newsletterModal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">
                Load Design
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  {this.renderDesigns(Newsletters)}
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
