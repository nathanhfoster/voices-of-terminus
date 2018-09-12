import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import { Image } from 'react-bootstrap'
import femaleElf from '../../images/elf_female.png'
import maleElf from '../../images/elf_male.png'
import femaleHalfling from '../../images/halfling_female.png'
import maleHalfling from '../../images/halfling_male.png'
import femaleHuman from '../../images/human_female.png'
import maleHuman from '../../images/human_male.png'
import {getRandomInt} from '../../helpers/helpers'

const mapStateToProps = ({Window}) => ({
  Window
})

const mapDispatchToProps = {
}

class Footer extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      isMobile: false
    }
  }

  static propTypes = { 
    femaleImages: PropTypes.array,
    maleImgaes: PropTypes.array,
    isMobile: PropTypes.bool
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
    const {Window} = props
    this.setState({
      isMobile: Window.innerWidth < 1200
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
   const {isMobile} = this.state
    const randInt = getRandomInt(0, 2)
    return (
      <div>
      {!isMobile ? [
        <Image className="Female footerImages" src={this.props.femaleImages[randInt]} height="400px"/>,
        <Image className="Male footerImages"   src={this.props.maleImgaes[randInt]}   height="400px"/>,
      ]: null }
      
      </div>
   
  
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Footer)