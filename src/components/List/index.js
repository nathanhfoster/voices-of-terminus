import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class List extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      data: []
    }
  }

  static propTypes = { 
    data: PropTypes.array
  }

  static defaultProps = {
    data: []
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
    const {data} = props
    this.setState({
      data
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderItems = data => data.map(k => {
    return(
      <div className="listItem">{k.name}</div>
    )
  })

  render() {
    const {data} = this.state
    return (
      <div className="List">
        {this.renderItems(data)}
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(List)