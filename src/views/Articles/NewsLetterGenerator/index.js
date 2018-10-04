import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, ButtonToolbar, Button} from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import EmailEditor from 'react-email-editor'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class NewsLetterGenerator extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  componentWillUpdate() {
  }

  /* render() */

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  exportHtml = () => {
    this.editor.exportHtml(data => {
      const { design, html } = data
      console.log('exportHtml', html)
    })
  }

  render() {
    return (
      <Grid className="NewsLetterGenerator Container">
        <Row>
          <ButtonToolbar className="buttonToolbar">
            <Button onClick={this.exportHtml}>Export HTML</Button>
          </ButtonToolbar>
        </Row>
        <Row>
          <EmailEditor minHeight="85vh" ref={editor => this.editor = editor}/>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(NewsLetterGenerator)