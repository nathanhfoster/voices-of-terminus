import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid} from 'react-bootstrap'
import './styles.css'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Card extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      Preview: null,
      Summary: {
        title: '',
        author: '',
        tags: {}
      }

    }
  }

  static propTypes = { 
    Preview: PropTypes.object,
    Summary: PropTypes.object,
    title: PropTypes.string,
    author: PropTypes.string,
    tags: PropTypes.object,
  }

  static defaultProps = {
    Preview: null,
      Summary: {
        title: '',
        author: '',
        tags: {}
      }
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
      <Grid className="Card">
        <div className="Preview">
          <div className="previewItem">
            PREVIEW ITEM CONTENT
          </div>
        </div>
        <div className="Summary">
          <h4>Title</h4>
          <h5>Author</h5>
          <h6>Tags</h6>
        </div>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Card)