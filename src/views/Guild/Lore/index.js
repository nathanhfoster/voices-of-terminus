import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, Image } from 'react-bootstrap'
import './styles.css'
import whispersOfTheVoices from '../../../images/jorconn.png'
import allForOne from '../../../images/allforone-start.png'
import intoTheKeep from '../../../images/teila.png'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Lore extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
    guildLore: [
      {link: 'https://www.yumpu.com/en/embed/view/9RweQIy8hYtfs7k3', img: whispersOfTheVoices},
    ],
    contestWinners: [
      {link: 'https://www.yumpu.com/en/embed/view/gyCLvhBQNGFK1YuS', img: allForOne},
      {link: 'https://www.yumpu.com/en/embed/view/BxFJtZzRsNvLTEg8', img: intoTheKeep},
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

  renderLoreItems = loreItems => loreItems.map(k => {
    return (
      <Col lg={5} md={5} sm={12} xs={12}>
        <a href={k.link} target="_blank">
          <Image src={k.img} responsive/>
        </a>
      </Col>
    )
  })

  render() {
    const {guildLore, contestWinners} = this.props
    return (
      <Grid className="LoreContainer">
        <Row>
          <h3>Guild Lore</h3>
          {this.renderLoreItems(guildLore)}
        </Row>
        <Row>
          <h3>08/2016 Contest Winners</h3>
          {this.renderLoreItems(contestWinners)}
        </Row>          
      </Grid>

    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Lore)