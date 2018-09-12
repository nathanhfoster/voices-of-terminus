import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid} from 'react-bootstrap'
import './styles.css'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Preview: null,
      Title: '',
      Author: '',
      Tags: []
    }
  }

  static propTypes = { 
    Preview: PropTypes.object,
    Title: PropTypes.string,
    Author: PropTypes.string,
    Tags: PropTypes.array,
  }

  static defaultProps = {
    Preview: null,
    Title: '',
    Author: '',
    Tags: []
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate() {
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
    const {Preview, Title, Author, Tags} = props
    this.setState({
      Preview,
      Title,
      Author,
      Tags
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {Preview, Title, Author, Tags} = this.state
    return (
      <Grid className="Clickable Card">
        <div className="Preview">
          <div className="previewItem">
            {Preview}
          </div>
        </div>
        <div className="Summary">
          <h4>{Title}</h4>
          <h5>{Author}</h5>
          <h6>[{Tags.map(k => <b>{k} </b>)}]</h6>
        </div>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Card)