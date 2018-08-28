import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Team extends Component {
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
      <div className="TeamContainer">
        Team
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Team)