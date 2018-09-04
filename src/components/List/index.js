import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import Moment from 'react-moment'
import MomentJS from 'moment'
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
      activeDate: Date,
      data: []
    }
  }

  static propTypes = { 
    activeDate: PropTypes.Date,
    data: PropTypes.array
  }

  static defaultProps = {
    activeDate: Date,
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
    const {activeDate, data} = props
    this.setState({
      activeDate,
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
    const activeDate = MomentJS(this.state.activeDate)
    const startTime = MomentJS(k.startTime)
    const sameDayEvent = startTime.isSame(activeDate, 'day')
  
    return(
     <div> {
       sameDayEvent ? 
      <ListGroupItem className="Clickable listItem"  header={k.name}>
       <span className="EventColorLabelContainer" />
       <Moment format="HH:mm a - ">{k.startTime}</Moment>
       <Moment format="HH:mm a">{k.endTime}</Moment>
      </ListGroupItem> 
      : null }
     </div>
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