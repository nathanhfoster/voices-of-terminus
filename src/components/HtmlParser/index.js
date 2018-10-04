import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
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
    const {htmlDocument} = props
    this.setState({
      props
      })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {htmlDocument} = this.state
    return (
      <div className="HtmlParser">
        {ReactHtmlParser(htmlDocument) }
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(HtmlParser)