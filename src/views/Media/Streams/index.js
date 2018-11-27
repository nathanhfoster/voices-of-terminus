import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'
import {getVotTwitchStreams} from '../../../actions/App'

const mapStateToProps = ({VotTwitchStreams}) => ({
  VotTwitchStreams
})

const mapDispatchToProps = {
  getVotTwitchStreams
}

class Streams extends PureComponent {
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
    this.props.getVotTwitchStreams()
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {VotTwitchStreams} = props
    this.setState({VotTwitchStreams})
  }

  render() {
    const {VotTwitchStreams} = this.state
    console.log(VotTwitchStreams)
    return (
      <div className="Streams">
        Streams
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Streams)