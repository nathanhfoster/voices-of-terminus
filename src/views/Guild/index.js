import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import Charters from './Charters'
import Lore from './Lore'
import Roster from './Roster'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Guild extends Component {
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
  }

  componentWillReceiveProps(nextProps) {
  }

  getState = props => {
    this.setState({
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="GuildContainer">
        <Charters />
        <Lore />
        <Roster />
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Guild)