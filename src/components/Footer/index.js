import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import { Image } from 'react-bootstrap'
import femaleElf from '../../images/backgrounds/elf_female.png'
import maleElf from '../../images/backgrounds/elf_male.png'
import femaleHalfling from '../../images/backgrounds/halfling_female.png'
import maleHalfling from '../../images/backgrounds/halfling_male.png'
import femaleHuman from '../../images/backgrounds/human_female.png'
import maleHuman from '../../images/backgrounds/human_male.png'
import {getRandomInt} from '../../helpers'

const mapStateToProps = ({Window}) => ({
  Window
})

const mapDispatchToProps = {
}

class Footer extends PureComponent {
  constructor(props) {
    super(props)
 
    this.state = {
      shouldShow: false
    }
  }

  static propTypes = { 
    femaleImages: PropTypes.array,
    maleImgaes: PropTypes.array,
    shouldShow: PropTypes.bool
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
    this.setState({Footer, shouldShow: Window.innerWidth > 1550})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
   const {shouldShow} = this.state
    const randInt = getRandomInt(0, 2)
    return (
      <div className="Footer">
        {shouldShow ? [
          <Image className="Female footerImages" src={this.props.femaleImages[randInt]} />,
          <Image className="Male footerImages"   src={this.props.maleImgaes[randInt]}  />,
        ]: null }
      </div>
   
  
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Footer)