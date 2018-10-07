import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row} from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import {getNewsLetter, clearNewsLetter} from '../../actions/NewsLetter'

const mapStateToProps = ({HtmlDocument}) => ({
  HtmlDocument
})

const mapDispatchToProps = {
  getNewsLetter,
  clearNewsLetter
}

class HtmlParser extends Component {
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

  componentDidMount() {
    this.props.getNewsLetter(this.props.match.params.id)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {HtmlDocument} = props
    this.setState({HtmlDocument})
  }

  componentWillUnmount() {
    this.props.clearNewsLetter()
    this.setState({HtmlDocument: null})
  }

  render() {
    const {html} = this.state.HtmlDocument
    return (
      <Grid className="HtmlParser Container">
        <Row>
          {ReactHtmlParser(html)}
        </Row> 
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(HtmlParser)