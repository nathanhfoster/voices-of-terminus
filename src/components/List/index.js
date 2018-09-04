import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import Moment from 'react-moment'
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
      <ListGroupItem className="listItem"  header={k.name}>
        <span className="EventColorLabelContainer" />
        <Moment format="HH:mm a - ">{k.startTime}</Moment>
        <Moment format="HH:mm a">{k.endTime}</Moment>
      </ListGroupItem>
    )
  })

  render() {
    const {data} = this.state
    return (
      <ListGroup className="List">
        {this.renderItems(data)}
      </ListGroup>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(List)