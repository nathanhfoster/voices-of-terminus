import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, ButtonToolbar, Button, Modal, Form} from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import EmailEditor from 'react-email-editor'
import {postNewsletter, getNewsletters, getNewsLetter, deleteNewsLetter, updateNewsLetter} from '../../actions/NewsLetter'
import {clearHtmlDocument} from '../../actions/App'
import {withRouter, Redirect} from 'react-router-dom'
import defaultDesign from './defaultDesign.json'
import Card from '../Card'

const mapStateToProps = ({Newsletters, HtmlDocument, User}) => ({
  Newsletters,
  HtmlDocument,
  User
})

const mapDispatchToProps = {
  getNewsletters,
  getNewsLetter,
  deleteNewsLetter,
  updateNewsLetter,
  clearHtmlDocument,
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
    this.getState(this.props)
  }

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User, Newsletters, HtmlDocument} = props
    this.setState({User, Newsletters, HtmlDocument})
  }

  componentWillUnmount(){
    this.props.clearHtmlDocument()
    this.setState({HtmlDocument: null})
  }

  postNewsletter = () => {
    const {User} = this.state
    this.editor.exportHtml(data => {
      let { design, html } = data
      design = JSON.stringify(design)
      postNewsletter({title: 'Test', slug:"news", author: User.id, html, design, last_modified_by: User.id})
    })
  }

  loadNewsletterDesign = design => this.editor.loadDesign(design)

  onDesignLoad = data => {
   console.log('onDesignLoad', data)
   //this.editor.setMergeTags([{name: 'First Name'}])
  }

  updateNewsletter = () => {
    const {id} = this.props.match.params
    this.editor.exportHtml(data => {
      let { design, html } = data
      design = JSON.stringify(design)
      const title = "Changed"
      this.props.updateNewsLetter(id, {title, design, html})
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
  
  handleHide = id => {
    if(id) { this.props.getNewsLetter(id) }
    this.setState({show: false})
  }
  
  render() {
    const {User, Newsletters} = this.state
    const design = this.state.HtmlDocument.hasOwnProperty('design') ? JSON.parse(this.state.HtmlDocument.design) : null
    // True if there are paramaters in the url, redux updated the state in getstate(), and if the editor has loaded into memory
    const isEditingDesign = this.props.match && design && this.editor && window.unlayer
   
    const styles = {
      boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.25)'
    }
      
    return (
      !User.token ? <Redirect to={this.props.history.push("/login")}/>
      :<Grid className="NewsLetterGenerator Container">
        <Row>
          <ButtonToolbar className="ButtonToolbar actionButtons">
            <Button onClick={() => this.loadNewsletterDesign(defaultDesign)}>NEW</Button>
            <Button onClick={this.postNewsletter}>POST</Button>
            <Button onClick={this.updateNewsletter}>UPDATE</Button>
            <Button onClick={this.handleShow} className="pull-right">LOAD</Button>
            <Button onClick={this.updateNewsletter} className="pull-right">SAVE</Button>
          </ButtonToolbar>
        </Row>
        <Row>
          <EmailEditor minHeight="calc(100vh - 102px)" ref={editor => this.editor = editor} style={styles} 
          onDesignLoad={this.onDesignLoad} onLoad={isEditingDesign ? this.loadNewsletterDesign(design) : null}/>
        </Row> 
        <Row>
          <Modal
            {...this.props}
            show={this.state.show}
            onHide={this.handleHide}
            dialogClassName="customModal"
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