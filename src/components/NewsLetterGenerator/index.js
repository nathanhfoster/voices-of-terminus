import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, ButtonToolbar, Button} from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import EmailEditor from 'react-email-editor'
import {createNewsletter, getNewsletters} from '../../actions/NewsLetter'

const mapStateToProps = ({Newsletters, User}) => ({
  Newsletters,
  User
})

const mapDispatchToProps = {
  getNewsletters
}

class NewsLetterGenerator extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = {
    getNewsletters: PropTypes.func.isRequired
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.props.getNewsletters()
    this.getState(this.props)
  }

  componentDidMount() {
    
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User, Newsletters} = props
    console.log(Newsletters)
    this.setState({
      Newsletters,
      User
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
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
      console.log("STRINGFY: ", j)
      let p = JSON.parse(j)
      console.log("PARSE: ", p)
      this.setState({savedDesign: design})
    })
  }

  loadDesign = () => {
    const {savedDesign} = this.state
    console.log(savedDesign)
    this.editor.loadDesign(savedDesign)
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
            <Button onClick={this.loadDesign}>Load HTML</Button>
          </ButtonToolbar>
        </Row>
        <Row className="">
          <EmailEditor minHeight="85vh" ref={editor => this.editor = editor} style={styles}/>
        </Row>
        
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(NewsLetterGenerator)