import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, ButtonToolbar, Button, Modal, Form} from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import EmailEditor from 'react-email-editor'
import {createNewsletter} from '../../actions/NewsLetter'

const mapStateToProps = ({Newsletters, HtmlDocument, User}) => ({
  Newsletters,
  HtmlDocument,
  User
})

const mapDispatchToProps = {
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
    this.setState({
      Newsletters,
      HtmlDocument,
      User
      })
  }

  exportHtml = () => {
    const {User} = this.state
    this.editor.exportHtml(data => {
      let { design, html } = data
      design = JSON.stringify(design)
      createNewsletter({title: 'Test', slug:"news", author: User.id, html, design, last_modified_by: User.id})
    })
  }

  saveDesign = () => {
    this.editor.saveDesign(design => {
      let j = JSON.stringify(design)
      this.setState({savedDesign: design})
    })
  }

  renderDesigns = () => {
    
  }

  loadDesign = () => {
    let {design} = this.state.HtmlDocument
    design = JSON.parse(design)
    this.editor.loadDesign(design)
  }

  handleShow() {
    this.setState({show: true});
  }

  handleHide() {
    this.setState({show: false});
  }

  render() {
    const styles = {
      boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.25)',
    }
    return (
      <Grid className="NewsLetterGenerator Container">
        <Row>
          <ButtonToolbar className="ButtonToolbar">
            <Button onClick={this.exportHtml}>Export HTML</Button>
            <Button onClick={this.saveDesign}>Save HTML</Button>
            <Button onClick={this.loadDesign}>Load Design</Button>
            <Button onClick={this.handleShow}>All Designs</Button>
          </ButtonToolbar>
        </Row>
        <Row className="">
          <EmailEditor minHeight="85vh" ref={editor => this.editor = editor} style={styles}/>
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
export default reduxConnect(mapStateToProps, mapDispatchToProps)(NewsLetterGenerator)