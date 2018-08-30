import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import { Grid, Row, Col, Image, Button } from 'react-bootstrap'
import femaleElf from '../../images/elf_female.png'
import maleElf from '../../images/elf_male.png'
import femaleHalfling from '../../images/halfling_female.png'
import maleHalfling from '../../images/halfling_male.png'
import femaleHuman from '../../images/human_female.png'
import maleHuman from '../../images/human_male.png'
import faArrowUp from '@fortawesome/fontawesome-free-solid/faArrowUp'
import faArrowDown from '@fortawesome/fontawesome-free-solid/faArrowDown'
import {getRandomInt} from '../../helpers/helpers'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Footer extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      showFooter: true,
      showFooterIcon: [faArrowUp, faArrowDown]
    }
  }

  static propTypes = { 
    showFooter: PropTypes.bool,
    showFooterIcon: PropTypes.array
  }

  static defaultProps = {
    femaleImages: [
      femaleElf, femaleHalfling, femaleHuman
    ],
    maleImgaes: [
      maleElf, maleHalfling, maleHuman
    ]
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

  toggleFooter = () => {
    this.setState({ showFooter: !this.state.showFooter })
  }

  render() {
    const { showFooter, showFooterIcon } = this.state
    return ([
      <Image className="Female footerImages" src={this.props.femaleImages[getRandomInt(0, 2)]} height="400px"/>,
      <Image className="Male footerImages"   src={this.props.maleImgaes[getRandomInt(0, 2)]}   height="400px"/>,
    ])
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Footer)