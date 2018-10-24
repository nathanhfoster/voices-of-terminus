import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, PageHeader, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import Moment from 'react-moment'
import {updateProfile} from '../../actions/User'
import Select from 'react-select'
import './styles.css'
import './stylesM.css'
import {selectStyles} from '../../helpers/styles'

const mapStateToProps = ({User}) => ({
  User
})

const mapDispatchToProps = {
  updateProfile
}

class Profile extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
        token: '', 
        id: '',
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        profile_image: null,
        is_staff: false, 
        is_superuser: false, 
        date_joined: '',
        last_login: '',
        bio: '', 
        primary_role: '',
        primary_class: '', 
        secondary_role: '', 
        secondary_class: '',
        profession: '',
        profession_specialization: '',
        discord_url: '', 
        twitter_url: '', 
        twitch_url: '', 
        youtube_url: ''
    }
  }

  static propTypes = {
    User: PropTypes.object,
    token: PropTypes.number, 
    id: PropTypes.number,
    username: PropTypes.string,
    profile_image: PropTypes.object,
    is_superuser: PropTypes.bool, 
    is_staff: PropTypes.bool, 
    bio: PropTypes.string, 
    primary_role: PropTypes.string,
    primary_class: PropTypes.string, 
    secondary_role: PropTypes.string, 
    secondary_class: PropTypes.string, 
    date_joined: PropTypes.date, 
    discord_url: PropTypes.string, 
    twitter_url: PropTypes.string, 
    twitch_url: PropTypes.string, 
    youtube_url: PropTypes.string
  }

  static defaultProps = {
    raceRoleClassOptions: {
      'Archai': { // Bard, Druid, Monk, Shaman, Warrior, Wizard
        roleOptions: [
          {value: 'Healer', label: 'Healer'},
          {value: 'Melee Dps', label: 'Melee Dps'},
          {value: 'Off Tank', label: 'Off Tank'},
          {value: 'Ranged Dps', label: 'Ranged Dps'},
          {value: 'Support', label: 'Support'},
          {value: 'Tank', label: 'Tank'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Healer':        [{value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
          'Melee Dps':     [{value: 'Monk', label: 'Monk'}],
          'Off Tank':      [{value: 'Monk', label: 'Monk'}],
          'Ranged Dps':    [{value: 'Wizard', label: 'Wizard'}],
          'Support':       [{value: 'Bard', label: 'BARD'}, {value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
          'Tank':          [{value: 'Warrior', label: 'Warrior'}],
          'Utility':       [{value: 'Bard', label: 'BARD'}, {value: 'Druid', label: 'Druid'}, {value: 'Enchanter', label: 'Enchanter'}, {value: 'Monk', label: 'Monk'}, {value: 'Shaman', label: 'Shaman'}, {value: 'Warrior', label: 'Warrior'}, {value: 'Wizard', label: 'Wizard'}]
        }
      },
      'Dark Myr': { // Bard, Cleric, Dire Lord, Druid, Enchanter, Monk, Necromancer, Rogue, Summoner, Warrior, Wizard
        roleOptions: [
          {value: 'Crowd Control', label: 'Crowd Control'},
          {value: 'Healer', label: 'Healer'},
          {value: 'Melee Dps', label: 'Melee Dps'},
          {value: 'Off Tank', label: 'Off Tank'},
          {value: 'Ranged Dps', label: 'Ranged Dps'},
          {value: 'Support', label: 'Support'},
          {value: 'Tank', label: 'Tank'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', label: 'Enchanter'}],
          'Healer':        [{value: 'Cleric', label: 'Cleric'}, {value: 'Druid', label: 'Druid'}],
          'Melee Dps':     [{value: 'Monk', label: 'Monk'}, {value: 'Rogue', label: 'Rogue'}],
          'Off Tank':      [{value: 'Monk', label: 'Monk'}],
          'Ranged Dps':    [{value: 'Necormancer', label: 'Necromancer'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Wizard', label: 'Wizard'}],
          'Support':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}, {value: 'Druid', label: 'Druid'}],
          'Tank':          [{value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Warrior', label: 'Warrior'}],
          'Utility':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}, {value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Druid', label: 'Druid'}, {value: 'Enchanter', label: 'Enchanter'}, {value: 'Monk', label: 'Monk'}, {value: 'Necormancer', label: 'Necromancer'}, {value: 'Rogue', label: 'Rogue'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Warrior', label: 'Warrior'}, {value: 'Wizard', label: 'Wizard'}]
        }
      },
      'Dwarf': { // Bard, Cleric, Enchanter, Paladin, Rogue, Warrior
        roleOptions: [
          {value: 'Crowd Control', label: 'Crowd Control'},
          {value: 'Healer', label: 'Healer'},
          {value: 'Melee Dps', label: 'Melee Dps'},
          {value: 'Support', label: 'Support'},
          {value: 'Tank', label: 'Tank'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', label: 'Enchanter'}],
          'Healer':        [{value: 'Cleric', label: 'Cleric'}],
          'Melee Dps':     [{value: 'Rogue', label: 'Rogue'}],
          'Support':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}],
          'Tank':          [{value: 'Paladin', label: 'Paladin'}, {value: 'Warrior', label: 'Warrior'}],
          'Utility':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}, {value: 'Enchanter', label: 'Enchanter'}, {value: 'Paladin', label: 'Paladin'}, {value: 'Rogue', label: 'Rogue'}, {value: 'Warrior', label: 'Warrior'}]
        }
      },
      'Elf': { // Bard, Druid, Enchanter, Ranger, Rogue, Shman, Summoner, Warrior, Wizard
        roleOptions: [
          {value: 'Crowd Control', label: 'Crowd Control'},
          {value: 'Healer', label: 'Healer'},
          {value: 'Melee Dps', label: 'Melee Dps'},
          {value: 'Ranged Dps', label: 'Ranged Dps'},
          {value: 'Support', label: 'Support'},
          {value: 'Tank', label: 'Tank'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', label: 'Enchanter'}],
          'Healer':        [{value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
          'Melee Dps':     [{value: 'Ranger', label: 'Ranger'}, {value: 'Rogue', label: 'Rogue'}],
          'Ranged Dps':    [{value: 'Ranger', label: 'Ranger'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Wizard', label: 'Wizard'}],
          'Support':       [{value: 'Bard', label: 'BARD'}, {value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
          'Tank':          [{value: 'Paladin', label: 'Paladin'}, {value: 'Warrior', label: 'Warrior'}],
          'Utility':       [{value: 'Bard', label: 'BARD'}, {value: 'Druid', label: 'Druid'}, {value: 'Enchanter', label: 'Enchanter'}, {value: 'Ranger', label: 'Ranger'}, {value: 'Rogue', label: 'Rogue'}, {value: 'Shaman', label: 'Shaman'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Warrior', label: 'Warrior'}, {value: 'Wizard', label: 'Wizard'}]
        }
      },
      'Halfling': { // Bard, Druid, Ranger, Rogue, Warrior
        roleOptions: [
          {value: 'Healer', label: 'Healer'},
          {value: 'Melee Dps', label: 'Melee Dps'},
          {value: 'Ranged Dps', label: 'Ranged Dps'},
          {value: 'Tank', label: 'Tank'},
          {value: 'Support', label: 'Support'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Healer':        [{value: 'Druid', label: 'Druid'}],
          'Melee Dps':     [{value: 'Ranger', label: 'Ranger'}, {value: 'Rogue', label: 'Rogue'}],
          'Ranged Dps':    [{value: 'Ranger', label: 'Ranger'}],
          'Support':       [{value: 'Bard', label: 'BARD'}, {value: 'Druid', label: 'Druid'}],
          'Tank':          [{value: 'Warrior', label: 'Warrior'}],
          'Utility':       [{value: 'Bard', label: 'BARD'}, {value: 'Druid', label: 'Druid'}, {value: 'Ranger', label: 'Ranger'}, {value: 'Rogue', label: 'Rogue'}, {value: 'Warrior', label: 'Warrior'}]
        }
      },
      'Human': { // ALL
        roleOptions: [
          {value: 'Crowd Control', label: 'Crowd Control'},
          {value: 'Healer', label: 'Healer'},
          {value: 'Melee Dps', label: 'Melee Dps'},
          {value: 'Off Tank', label: 'Off Tank'},
          {value: 'Ranged Dps', label: 'Ranged Dps'},
          {value: 'Support', label: 'Support'},
          {value: 'Tank', label: 'Tank'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', label: 'Enchanter'}],
          'Healer':        [{value: 'Cleric', label: 'Cleric'}, {value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
          'Melee Dps':     [{value: 'Monk', label: 'Monk'}, {value: 'Ranger', label: 'Ranger'}, {value: 'Rogue', label: 'Rogue'}],
          'Off Tank':      [{value: 'Monk', label: 'Monk'}],
          'Ranged Dps':    [{value: 'Ranger', label: 'Ranger'}, {value: 'Necormancer', label: 'Necromancer'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Wizard', label: 'Wizard'}],
          'Support':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}, {value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
          'Tank':          [{value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Paladin', label: 'Paladin'}, {value: 'Warrior', label: 'Warrior'}],
          'Utility':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}, {value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Druid', label: 'Druid'}, {value: 'Enchanter', label: 'Enchanter'}, {value: 'Monk', label: 'Monk'}, {value: 'Necormancer', label: 'Necromancer'}, {value: 'Paladin', label: 'Paladin'}, {value: 'Ranger', label: 'Ranger'}, {value: 'Rogue', label: 'Rogue'}, {value: 'Shaman', label: 'Shaman'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Warrior', label: 'Warrior'}, {value: 'Wizard', label: 'Wizard'}]
        }
      },
      'Gnome': { // Enchanter, Necromancer, Rogue, Summoner, Wizard
        roleOptions: [
          {value: 'Crowd Control', label: 'Crowd Control'},
          {value: 'Melee Dps', label: 'Melee Dps'},
          {value: 'Ranged Dps', label: 'Ranged Dps'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', label: 'Enchanter'}],
          'Melee Dps':     [{value: 'Rogue', label: 'Rogue'}],
          'Ranged Dps':    [{value: 'Necormancer', label: 'Necromancer'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Wizard', label: 'Wizard'}],
          'Utility':       [{value: 'Enchanter', label: 'Enchanter'}, {value: 'Necormancer', label: 'Necromancer'}, {value: 'Paladin', label: 'Paladin'}, {value: 'Rogue', label: 'Rogue'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Wizard', label: 'Wizard'}]
        }
      }, 
      'Ogre': { // Dire Lord, Druid, Shaman, Warrior
        roleOptions: [
          {value: 'Healer', label: 'Healer'},
          {value: 'Support', label: 'Support'},
          {value: 'Tank', label: 'Tank'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Healer':        [{value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
          'Support':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}, {value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
          'Tank':          [{value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Warrior', label: 'Warrior'}],
          'Utility':       [{value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}, {value: 'Warrior', label: 'Warrior'}]
        }
      },
      'Skar': { // Dire Lord, Monk, Necromancer, Rogue, Shaman, Warrior
        roleOptions: [
          {value: 'Healer', label: 'Healer'},
          {value: 'Melee Dps', label: 'Melee Dps'},
          {value: 'Off Tank', label: 'Off Tank'},
          {value: 'Ranged Dps', label: 'Ranged Dps'},
          {value: 'Support', label: 'Support'},
          {value: 'Tank', label: 'Tank'},
          {value: 'Utility', label: 'Utility'},     
        ],
        classOptions: {
          'Healer':        [{value: 'Shaman', label: 'Shaman'}],
          'Melee Dps':     [{value: 'Monk', label: 'Monk'},{value: 'Rogue', label: 'Rogue'}],
          'Off Tank':      [{value: 'Monk', label: 'Monk'}],
          'Ranged Dps':    [{value: 'Necormancer', label: 'Necromancer'}],
          'Support':       [{value: 'Shaman', label: 'Shaman'}],
          'Tank':          [{value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Warrior', label: 'Warrior'}],
          'Utility':       [{value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Monk', label: 'Monk'}, {value: 'Necormancer', label: 'Necromancer'}, {value: 'Rogue', label: 'Rogue'}, {value: 'Shaman', label: 'Shaman'}, {value: 'Warrior', label: 'Warrior'}]
        }
      }
    },
    raceOptions: [
      {value: 'Archai', label: 'Archai'}, // Bard, Druid, Monk, Shaman, Warrior, Wizard
      {value: 'Dark Myr', label: 'Dark Myr'}, // Bard, Cleric, Dire Lord, Druid, Enchanter, Monk, Necromancer, Rogue, Summoner, Warrior, Wizard
      {value: 'Dwarf', label: 'Dwarf'}, // Bard, Cleric, Enchanter, Paladin, Rogue, Warrior
      {value: 'Elf', label: 'Elf'}, // Bard, Druid, Enchanter, Ranger, Rogue, Shman, SUmmoner, Warrior, Wizard
      {value: 'Halfling', label: 'Halfling'}, // Bard, Druid, Ranger, Rogue, Warrior
      {value: 'Human', label: 'Human'}, // ALL
      {value: 'Gnome', label: 'Gnome'}, // Enchanter, Necromancer, Rogue, Summoner, Wizard
      {value: 'Ogre', label: 'Ogre'}, // Dire Lord, Druid, Shaman, Warrior
      {value: 'Skar', label: 'Skar'} // Skar, Mink, Necrimancer, Rogue, Shaman
    ],
    roleOptions: [
      {value: 'Crowd Control', label: 'Crowd Control'},
      {value: 'Healer', label: 'Healer'},
      {value: 'Melee Dps', label: 'Melee Dps'},
      {value: 'Off Tank', label: 'Off Tank'},
      {value: 'Ranged Dps', label: 'Ranged Dps'},
      {value: 'Support', label: 'Support'},
      {value: 'Tank', label: 'Tank'},
      {value: 'Utility', label: 'Utility'},     
    ],
    classOptions: {
      'Crowd Control': [{value: 'Enchanter', label: 'Enchanter'}, ],
      'Melee Dps':     [{value: 'Monk', label: 'Monk'}, {value: 'Ranger', label: 'Ranger'}, {value: 'Rogue', label: 'Rogue'}],
      'Off Tank':      [{value: 'Monk', label: 'Monk'}],
      'Ranged Dps':    [{value: 'Ranger', label: 'Ranger'}, {value: 'Necormancer', label: 'Necromancer'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Wizard', label: 'Wizard'}],
      'Healer':        [{value: 'Cleric', label: 'Cleric'}, {value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
      'Tank':          [{value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Paladin', label: 'Paladin'}, {value: 'Warrior', label: 'Warrior'}],
      'Support':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}, {value: 'Druid', label: 'Druid'}, {value: 'Shaman', label: 'Shaman'}],
      'Utility':       [{value: 'Bard', label: 'BARD'}, {value: 'Cleric', label: 'Cleric'}, {value: 'Dire Lord', label: 'Dire Lord'}, {value: 'Druid', label: 'Druid'}, {value: 'Enchanter', label: 'Enchanter'}, {value: 'Monk', label: 'Monk'}, {value: 'Necormancer', label: 'Necromancer'}, {value: 'Paladin', label: 'Paladin'}, {value: 'Ranger', label: 'Ranger'}, {value: 'Rogue', label: 'Rogue'}, {value: 'Shaman', label: 'Shaman'}, {value: 'Summoner', label: 'Summoner'}, {value: 'Warrior', label: 'Warrior'}, {value: 'Wizard', label: 'Wizard'}]
    },
      // {value: 'Cleric', label: 'Cleric'},
      // {value: 'Dire Lord', label: 'Dire Lord'},
      // {value: 'Druid', label: 'Druid'},
      // {value: 'Enchanter', label: 'Enchanter'},
      // {value: 'Monk', label: 'Monk'},
      // {value: 'Paladin', label: 'Paladin'},
      // {value: 'Ranger', label: 'Ranger'},
      // {value: 'Rogue', label: 'Rogue'},
      // {value: 'Shaman', label: 'Shaman'},
      // {value: 'Summoner', label: 'Summoner'},
      // {value: 'Warrior', label: 'Warrior'},
      // {value: 'Wizard', label: 'Wizard'}
    professionOptions: [
      {value: 'Alchemist',   label: 'Alchemist'},
      {value: 'Blacksmith',  label: 'Blacksmith'},
      {value: 'Outfitter',   label: 'Outfitter'},
      {value: 'Provisioner', label: 'Provisioner'},
      {value: 'Scribe',      label: 'Scribe'},
      {value: 'Stonemason',  label: 'Stonemason'},
      {value: 'Woodworker',  label: 'Woodworker'},
    ],
    professionSpecializationOptions: {
      Alchemist:   [],
      Blacksmith:  [{value: 'Armorsmith', label: 'Armorsmith'}, {value: 'Weaponsmith',   label: 'Weaponsmith'}],
      Outfitter:   [{value: 'Leatherworker', label: 'Leatherworker'}, {value: 'Tailor',     label: 'Tailor'}],
      Provisioner: [{value: 'Brewer',        label: 'Brewer'},        {value: 'Chef',       label: 'Chef'}],
      Scribe:      [{value: 'Engraver',      label: 'Engraver'},      {value: 'Researcher', label: 'Researcher'}],
      Stonemason:  [{value: 'Jeweller',      label: 'Jeweller'},      {value: 'Sculptor',   label: 'Sculptor'}],
      Woodworker:  [{value: 'Bowyer',        label: 'Bowyer'},        {value: 'Carver',     label: 'Carver'}],
    }
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {token, id, username, email, first_name, last_name, profile_image, is_superuser, is_staff, date_joined, last_login, bio, primary_race, primary_role, primary_class, secondary_race, secondary_role, secondary_class, profession, profession_specialization, discord_url, twitter_url, twitch_url, youtube_url, experiencePoints} = props.User
    /*Validate Data*/
    // const primary_role = props.User.primary_role ? props.User.primary_role : props.defaultRole
    // const primary_class = props.User.primary_class ? props.User.primary_class : props.defaultClass
    // const secondary_class = props.User.secondary_class ? props.User.secondary_class : props.defaultClass
    // const secondary_role = props.User.secondary_role ? props.User.secondary_role : props.defaultRole
    // const profession = props.User.profession ? props.User.profession : props.defaultProfession
    // const profession_specialization = props.User.profession_specialization ? props.User.profession_specialization : props.defaultProfessionSpecialization
    const {password} = this.state
    this.setState({token, id, username, password, email, first_name, last_name, profile_image, is_superuser, is_staff, date_joined, last_login, bio, primary_race, primary_role, primary_class, secondary_race, secondary_role, secondary_class, profession, profession_specialization, date_joined, discord_url, twitter_url, twitch_url, youtube_url, experiencePoints})
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

  setImage = (e) => this.setState({profile_image: e.target.files[0]})
  

  validateUsername() {
    const {username} = this.state
    if(username) {
      const {length} = username
      if (length > 4) return 'success'
      else if (length > 2) return 'warning'
      else if (length > 0) return 'error'
  }
    return null
  }

  validatePassword() {
    const {password} = this.state
    const {length} = password
    if (this.hasSpecialChar(password)) return 'success'
    else if (length > 7) return 'warning'
    else if (length > 0 && length < 7) return 'error'
    else if (length === 0) return null
    return null
  }

  validateEmail() {
    const validator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const {email} = this.state
    if(validator.test(email)) return 'success'
    return null
  }

  cantSubmit = () => {
    if(
      (this.validateUsername() === 'success' || this.validateUsername() === 'warning')  &&
      (this.validatePassword() === null || this.validatePassword() === 'success' || this.validatePassword() === 'warning') &&
      (this.validateEmail()    === 'success' || this.validateEmail()    === 'warning')
    ) return true
    
    return false
  }

  hasSpecialChar = s => /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(s)

  renderOptions = Options => Options ? Options.map(option => <option value={option.value}>{option.label}</option>) : this.defaultOption()

  updateProfile = () => {
    const {token, id, username, email, first_name, last_name, profile_image, bio, primary_race, primary_role, primary_class, secondary_race, secondary_role, secondary_class, profession, profession_specialization, discord_url, twitter_url, twitch_url, youtube_url} = this.state
    const payload ={
      username, email, first_name, last_name, profile_image, bio,
      primary_race, primary_role, primary_class,
      secondary_race, secondary_role, secondary_class,
      profession, profession_specialization,
      discord_url, twitter_url, twitch_url, youtube_url
    }
    this.props.updateProfile(id, payload)
  }

  defaultOption = () => <option disabled value="">SELECT</option>

  render() {
    const {raceOptions, raceRoleClassOptions, roleOptions, classOptions, professionOptions, professionSpecializationOptions} = this.props
    const canSubmit = !this.cantSubmit()
    const {token, id, username, password, email, first_name, last_name, profile_image, is_superuser, is_staff, date_joined, last_login, bio, primary_race, primary_role, primary_class, secondary_race, secondary_role, secondary_class, profession, profession_specialization, discord_url, twitter_url, twitch_url, youtube_url, experiencePoints} = this.state
    return (
      !token ? <Redirect to={this.props.history.push('/login')}/>
      :<Grid className="Profile Container">
        <Row>
          <PageHeader className="pageHeader">PROFILE</PageHeader>
        </Row>
        <Row>
          <Col md={4}><h3>Experience Points: {experiencePoints} / 10000<progress value={experiencePoints} min="0" max="10000"></progress></h3></Col>
          <Col md={4}><h3>Joined:  <Moment format="MMMM DD, YYYY">{date_joined}</Moment></h3></Col>
          <Col md={4}><h3>Last Login:  <Moment fromNow>{last_login}</Moment></h3></Col>
        </Row>
        <Row>
          <Col md={12}><h3>ACCOUNT</h3></Col>
        </Row>
        <Form className="accontForm Container fadeIn-2">
          <Row>
            <Col md={12}>
              <FormGroup validationState={this.validateUsername()}>
                <ControlLabel>Username</ControlLabel>
                <FormControl value={username} type="text" name="username" placeholder="Username" onChange={this.onChange}/>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup validationState={this.validatePassword()}>
                <ControlLabel>Password</ControlLabel>
                <FormControl value={password} type="password" name="password" placeholder="Password" onChange={this.onChange}/>
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup validationState={this.validateEmail()}>
                <ControlLabel>Email</ControlLabel>
                <FormControl value={email} type="email" name="email" placeholder="Email" onChange={this.onChange}/>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Profile Picture</ControlLabel>
                <FormControl type="file" label="File" name="profile_image" onChange={this.setImage} disabled/>
              </FormGroup>
            </Col>
            <Col md={6}>
            <FormGroup>
              <ControlLabel>First Name</ControlLabel>
              <FormControl value={first_name} type="text" name="first_name" placeholder="First Name" onChange={this.onChange}/>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Last Name</ControlLabel>
              <FormControl value={last_name} type="text" name="last_name" placeholder="Last Name" onChange={this.onChange}/>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>Bio</ControlLabel>
              <FormControl value={bio} componentClass="textarea" type="textarea" name="bio" placeholder="Bio" onChange={this.onChange}/>
            </FormGroup>
          </Col>
          <Col md={12}><h3>PRIMARY</h3></Col>
          <Col md={4}>
            <ControlLabel>RACE</ControlLabel>
            <Select
              value={primary_race ? {value: primary_race, label: primary_race} : null}
              onChange={(Race) => this.setState({primary_race: Race ? Race.value : ''})}
              options={raceOptions}
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </Col>
          <Col md={4}>
            <ControlLabel>ROLE</ControlLabel>
            <Select
              value={primary_role ? {value: primary_role, label: primary_role} : null}
              onChange={(Role) => this.setState({primary_role: Role ? Role.value : ''})}
              options={primary_race ? raceRoleClassOptions[primary_race].roleOptions : []}
              isClearable
              isSearchable
              isDisabled={!primary_race}
              styles={selectStyles}
              />
          </Col>
          <Col md={4}>
            <ControlLabel>CLASS</ControlLabel>
            <Select
              value={primary_class ? {value: primary_class, label: primary_class} : null}
              onChange={(Class) => this.setState({primary_class: Class ? Class.value : ''})}
              options={primary_race ? raceRoleClassOptions[primary_race].classOptions[primary_role] : []}
              isClearable
              isSearchable
              isDisabled={!primary_role}
              styles={selectStyles}
              />
          </Col>
          <Col md={12}><h3>SECONDARY</h3></Col>
            <Col md={4}>
              <ControlLabel>RACE</ControlLabel>
              <Select
                value={secondary_race ? {value: secondary_race, label: secondary_race} : null}
                onChange={(Race) => this.setState({secondary_race: Race ? Race.value : ''})}
                options={raceOptions}
                isClearable
                isSearchable
                styles={selectStyles}
              />
            </Col>
            <Col md={4}>
              <ControlLabel>ROLE</ControlLabel>
              <Select
                value={secondary_role ? {value: secondary_role, label: secondary_role} : null}
                onChange={(Role) => this.setState({secondary_role: Role ? Role.value : ''})}
                options={secondary_race ? raceRoleClassOptions[secondary_race].roleOptions : []}
                isClearable
                isSearchable
                isDisabled={!secondary_race}
                styles={selectStyles}
                />
            </Col>
            <Col md={4}>
              <ControlLabel>CLASS</ControlLabel>
              <Select
                value={secondary_class ? {value: secondary_class, label: secondary_class} : null}
                onChange={(Class) => this.setState({secondary_class: Class ? Class.value : ''})}
                options={secondary_race ? raceRoleClassOptions[secondary_race].classOptions[secondary_role] : []}
                isClearable
                isSearchable
                isDisabled={!secondary_role}
                styles={selectStyles}
                />
            </Col>
            <Col md={12}><h3>CRAFTING</h3></Col>
            <Col md={6}>
              <ControlLabel>Profession</ControlLabel>
              <Select
                value={profession ? {value: profession, label: profession} : null}
                onChange={(Profession) => this.setState({profession: Profession ? Profession.value : ''})}
                options={professionOptions}
                isClearable
                isSearchable
                styles={selectStyles}
                />
            </Col>
            <Col md={6}>
              <ControlLabel>Specialization</ControlLabel>
              <Select
                value={profession_specialization ? {value: profession_specialization, label: profession_specialization} : null}
                onChange={(ProfessionSpecialization) => this.setState({profession_specialization: ProfessionSpecialization ? ProfessionSpecialization.value : ''})}
                options={professionSpecializationOptions[profession]}
                isClearable
                isSearchable
                isDisabled={!profession}
                styles={selectStyles}
                />
            </Col>
            <Col md={12}><h3>CONNECTIONS</h3></Col>
            <Col md={3}>
              <FormGroup>
                <ControlLabel>Discord</ControlLabel>
                <FormControl value={discord_url} name="discord_url" type="text"  onChange={this.onChange}>
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <ControlLabel>Twitch</ControlLabel>
                <FormControl value={twitch_url} name="twitch_url" type="text" onChange={this.onChange}>
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <ControlLabel>Twitter</ControlLabel>
                <FormControl value={twitter_url} name="twitter_url" type="text" onChange={this.onChange}>
                </FormControl>
              </FormGroup>
            </Col>
            
            <Col md={3}>
              <FormGroup>
                <ControlLabel>YouTube</ControlLabel>
                <FormControl value={youtube_url} name="youtube_url" type="text"  onChange={this.onChange}>
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={12} style={{textAlign: 'center'}}>
              <Button onClick={this.updateProfile} disabled={canSubmit}>Update</Button>
            </Col>
          </Row>
        </Form>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Profile)