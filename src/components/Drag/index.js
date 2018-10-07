import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col} from 'react-bootstrap'
import Draggable, {DraggableCore} from 'react-draggable'
import './styles.css'
import './stylesM.css'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class Drag extends Component {
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
    this.setState({})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  eventLogger = (e: MouseEvent, data: Object) => {
    console.log('Event: ', e);
    console.log('Data: ', data);
  }

  render() {
    return (
      <div className="dragContainer">
       <Draggable
          axis="both"
          bounds="parent"
          handle=".handle"
          defaultPosition={{x: 25, y: 25}}
          position={null}
          grid={[25, 25]}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.handleStop}
        >
          <div className="handle">
          Text Box 1
          </div>
        </Draggable>

         <Draggable
          axis="both"
          bounds="parent"
          handle=".handle"
          defaultPosition={{x: 250, y: -175}}
          position={null}
          grid={[25, 25]}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.handleStop}
        >
          <div className="handle">
          Text Box 2
          </div>
        </Draggable>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Drag)