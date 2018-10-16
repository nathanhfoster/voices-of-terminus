import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, PageHeader, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import Moment from 'react-moment'
import {updateProfile} from '../../actions/User'
import './styles.css'
import './stylesM.css'

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
        firstName: '',
        lastName: '',
        profileImage: null,
        isStaff: false, 
        isSuperUser: false, 
        dateJoined: '',
        lastLogin: '',
        bio: '', 
        primaryRole: '',
        primaryClass: '', 
        secondaryRole: '', 
        secondaryClass: '',
        profession: '',
        professionSpecialization: '',
        dateJoined: '', 
        discordUrl: '', 
        twitterUrl: '', 
        twitchUrl: '', 
        youtubeUrl: ''
    }
  }

  static propTypes = {
    User: PropTypes.object,
    token: PropTypes.number, 
    id: PropTypes.number,
    username: PropTypes.string,
    profileImage: PropTypes.object,
    isSuperUser: PropTypes.bool, 
    isStaff: PropTypes.bool, 
    bio: PropTypes.string, 
    primaryRole: PropTypes.string,
    primaryClass: PropTypes.string, 
    secondaryRole: PropTypes.string, 
    secondaryClass: PropTypes.string, 
    dateJoined: PropTypes.date, 
    discordUrl: PropTypes.string, 
    twitterUrl: PropTypes.string, 
    twitchUrl: PropTypes.string, 
    youtubeUrl: PropTypes.string
  }

  static defaultProps = {
    raceRoleClassOptions: {
      'Archai': { // Bard, Druid, Monk, Shaman, Warrior, Wizard
        roleOptions: [
          {value: 'Healer', text: 'HEALER'},
          {value: 'Melee Dps', text: 'MELEE DPS'},
          {value: 'Off Tank', text: 'OFF TANK'},
          {value: 'Ranged Dps', text: 'RANGED DPS'},
          {value: 'Support', text: 'SUPPORT'},
          {value: 'Tank', text: 'TANK'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Healer':        [{value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
          'Melee Dps':     [{value: 'Monk', text: 'MONK'}],
          'Off Tank':      [{value: 'Monk', text: 'MONK'}],
          'Ranged Dps':    [{value: 'Wizard', text: 'WIZARD'}],
          'Support':       [{value: 'Bard', text: 'BARD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
          'Tank':          [{value: 'Warrior', text: 'WARRIOR'}],
          'Utility':       [{value: 'Bard', text: 'BARD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Enchanter', text: 'ENCHANTER'}, {value: 'Monk', text: 'MONK'}, {value: 'Shaman', text: 'SHAMAN'}, {value: 'Warrior', text: 'WARRIOR'}, {value: 'Wizard', text: 'WIZARD'}]
        }
      },
      'Dark Myr': { // Bard, Cleric, Dire Lord, Druid, Enchanter, Monk, Necromancer, Rogue, Summoner, Warrior, Wizard
        roleOptions: [
          {value: 'Crowd Control', text: 'CROWD CONTROL'},
          {value: 'Healer', text: 'HEALER'},
          {value: 'Melee Dps', text: 'MELEE DPS'},
          {value: 'Off Tank', text: 'OFF TANK'},
          {value: 'Ranged Dps', text: 'RANGED DPS'},
          {value: 'Support', text: 'SUPPORT'},
          {value: 'Tank', text: 'TANK'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', text: 'ENCHANTER'}],
          'Healer':        [{value: 'Cleric', text: 'CLERIC'}, {value: 'Druid', text: 'DRUID'}],
          'Melee Dps':     [{value: 'Monk', text: 'MONK'}, {value: 'Rogue', text: 'ROGUE'}],
          'Off Tank':      [{value: 'Monk', text: 'MONK'}],
          'Ranged Dps':    [{value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Wizard', text: 'WIZARD'}],
          'Support':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}, {value: 'Druid', text: 'DRUID'}],
          'Tank':          [{value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Warrior', text: 'WARRIOR'}],
          'Utility':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}, {value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Enchanter', text: 'ENCHANTER'}, {value: 'Monk', text: 'MONK'}, {value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Rogue', text: 'ROGUE'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Warrior', text: 'WARRIOR'}, {value: 'Wizard', text: 'WIZARD'}]
        }
      },
      'Dwarf': { // Bard, Cleric, Enchanter, Paladin, Rogue, Warrior
        roleOptions: [
          {value: 'Crowd Control', text: 'CROWD CONTROL'},
          {value: 'Healer', text: 'HEALER'},
          {value: 'Melee Dps', text: 'MELEE DPS'},
          {value: 'Support', text: 'SUPPORT'},
          {value: 'Tank', text: 'TANK'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', text: 'ENCHANTER'}],
          'Healer':        [{value: 'Cleric', text: 'CLERIC'}],
          'Melee Dps':     [{value: 'Rogue', text: 'ROGUE'}],
          'Support':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}],
          'Tank':          [{value: 'Paladin', text: 'PALADIN'}, {value: 'Warrior', text: 'WARRIOR'}],
          'Utility':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}, {value: 'Enchanter', text: 'ENCHANTER'}, {value: 'Paladin', text: 'PALADIN'}, {value: 'Rogue', text: 'ROGUE'}, {value: 'Warrior', text: 'WARRIOR'}]
        }
      },
      'Elf': { // Bard, Druid, Enchanter, Ranger, Rogue, Shman, Summoner, Warrior, Wizard
        roleOptions: [
          {value: 'Crowd Control', text: 'CROWD CONTROL'},
          {value: 'Healer', text: 'HEALER'},
          {value: 'Melee Dps', text: 'MELEE DPS'},
          {value: 'Ranged Dps', text: 'RANGED DPS'},
          {value: 'Support', text: 'SUPPORT'},
          {value: 'Tank', text: 'TANK'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', text: 'ENCHANTER'}],
          'Healer':        [{value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
          'Melee Dps':     [{value: 'Ranger', text: 'RANGER'}, {value: 'Rogue', text: 'ROGUE'}],
          'Ranged Dps':    [{value: 'Ranger', text: 'RANGER'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Wizard', text: 'WIZARD'}],
          'Support':       [{value: 'Bard', text: 'BARD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
          'Tank':          [{value: 'Paladin', text: 'PALADIN'}, {value: 'Warrior', text: 'WARRIOR'}],
          'Utility':       [{value: 'Bard', text: 'BARD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Enchanter', text: 'ENCHANTER'}, {value: 'Ranger', text: 'RANGER'}, {value: 'Rogue', text: 'ROGUE'}, {value: 'Shaman', text: 'SHAMAN'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Warrior', text: 'WARRIOR'}, {value: 'Wizard', text: 'WIZARD'}]
        }
      },
      'Halfling': { // Bard, Druid, Ranger, Rogue, Warrior
        roleOptions: [
          {value: 'Healer', text: 'HEALER'},
          {value: 'Melee Dps', text: 'MELEE DPS'},
          {value: 'Ranged Dps', text: 'RANGED DPS'},
          {value: 'Tank', text: 'TANK'},
          {value: 'Support', text: 'SUPPORT'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Healer':        [{value: 'Druid', text: 'DRUID'}],
          'Melee Dps':     [{value: 'Ranger', text: 'RANGER'}, {value: 'Rogue', text: 'ROGUE'}],
          'Ranged Dps':    [{value: 'Ranger', text: 'RANGER'}],
          'Support':       [{value: 'Bard', text: 'BARD'}, {value: 'Druid', text: 'DRUID'}],
          'Tank':          [{value: 'Warrior', text: 'WARRIOR'}],
          'Utility':       [{value: 'Bard', text: 'BARD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Ranger', text: 'RANGER'}, {value: 'Rogue', text: 'ROGUE'}, {value: 'Warrior', text: 'WARRIOR'}]
        }
      },
      'Human': { // ALL
        roleOptions: [
          {value: 'Crowd Control', text: 'CROWD CONTROL'},
          {value: 'Healer', text: 'HEALER'},
          {value: 'Melee Dps', text: 'MELEE DPS'},
          {value: 'Off Tank', text: 'OFF TANK'},
          {value: 'Ranged Dps', text: 'RANGED DPS'},
          {value: 'Support', text: 'SUPPORT'},
          {value: 'Tank', text: 'TANK'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', text: 'ENCHANTER'}],
          'Healer':        [{value: 'Cleric', text: 'CLERIC'}, {value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
          'Melee Dps':     [{value: 'Monk', text: 'MONK'}, {value: 'Ranger', text: 'RANGER'}, {value: 'Rogue', text: 'ROGUE'}],
          'Off Tank':      [{value: 'Monk', text: 'MONK'}],
          'Ranged Dps':    [{value: 'Ranger', text: 'RANGER'}, {value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Wizard', text: 'WIZARD'}],
          'Support':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}, {value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
          'Tank':          [{value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Paladin', text: 'PALADIN'}, {value: 'Warrior', text: 'WARRIOR'}],
          'Utility':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}, {value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Enchanter', text: 'ENCHANTER'}, {value: 'Monk', text: 'MONK'}, {value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Paladin', text: 'PALADIN'}, {value: 'Ranger', text: 'RANGER'}, {value: 'Rogue', text: 'ROGUE'}, {value: 'Shaman', text: 'SHAMAN'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Warrior', text: 'WARRIOR'}, {value: 'Wizard', text: 'WIZARD'}]
        }
      },
      'Gnome': { // Enchanter, Necromancer, Rogue, Summoner, Wizard
        roleOptions: [
          {value: 'Crowd Control', text: 'CROWD CONTROL'},
          {value: 'Melee Dps', text: 'MELEE DPS'},
          {value: 'Ranged Dps', text: 'RANGED DPS'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Crowd Control': [{value: 'Enchanter', text: 'ENCHANTER'}],
          'Melee Dps':     [{value: 'Rogue', text: 'ROGUE'}],
          'Ranged Dps':    [{value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Wizard', text: 'WIZARD'}],
          'Utility':       [{value: 'Enchanter', text: 'ENCHANTER'}, {value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Paladin', text: 'PALADIN'}, {value: 'Rogue', text: 'ROGUE'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Wizard', text: 'WIZARD'}]
        }
      }, 
      'Ogre': { // Dire Lord, Druid, Shaman, Warrior
        roleOptions: [
          {value: 'Healer', text: 'HEALER'},
          {value: 'Support', text: 'SUPPORT'},
          {value: 'Tank', text: 'TANK'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Healer':        [{value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
          'Support':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}, {value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
          'Tank':          [{value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Warrior', text: 'WARRIOR'}],
          'Utility':       [{value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}, {value: 'Warrior', text: 'WARRIOR'}]
        }
      },
      'Skar': { // Dire Lord, Monk, Necromancer, Rogue, Shaman, Warrior
        roleOptions: [
          {value: 'Healer', text: 'HEALER'},
          {value: 'Melee Dps', text: 'MELEE DPS'},
          {value: 'Off Tank', text: 'OFF TANK'},
          {value: 'Ranged Dps', text: 'RANGED DPS'},
          {value: 'Support', text: 'SUPPORT'},
          {value: 'Tank', text: 'TANK'},
          {value: 'Utility', text: 'UTILITY'},     
        ],
        classOptions: {
          'Healer':        [{value: 'Shaman', text: 'SHAMAN'}],
          'Melee Dps':     [{value: 'Monk', text: 'MONK'},{value: 'Rogue', text: 'ROGUE'}],
          'Off Tank':      [{value: 'Monk', text: 'MONK'}],
          'Ranged Dps':    [{value: 'Necormancer', text: 'NECROMANCER'}],
          'Support':       [{value: 'Shaman', text: 'SHAMAN'}],
          'Tank':          [{value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Warrior', text: 'WARRIOR'}],
          'Utility':       [{value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Monk', text: 'MONK'}, {value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Rogue', text: 'ROGUE'}, {value: 'Shaman', text: 'SHAMAN'}, {value: 'Warrior', text: 'WARRIOR'}]
        }
      }
    },
    raceOptions: [
      {value: 'Archai', text: 'ARCHAI'}, // Bard, Druid, Monk, Shaman, Warrior, Wizard
      {value: 'Dark Myr', text: 'DARK MYR'}, // Bard, Cleric, Dire Lord, Druid, Enchanter, Monk, Necromancer, Rogue, Summoner, Warrior, Wizard
      {value: 'Dwarf', text: 'DWARF'}, // Bard, Cleric, Enchanter, Paladin, Rogue, Warrior
      {value: 'Elf', text: 'ELF'}, // Bard, Druid, Enchanter, Ranger, Rogue, Shman, SUmmoner, Warrior, Wizard
      {value: 'Halfling', text: 'HALFLING'}, // Bard, Druid, Ranger, Rogue, Warrior
      {value: 'Human', text: 'HUMAN'}, // ALL
      {value: 'Gnome', text: 'GNOME'}, // Enchanter, Necromancer, Rogue, Summoner, Wizard
      {value: 'Ogre', text: 'OGRE'}, // Dire Lord, Druid, Shaman, Warrior
      {value: 'Skar', text: 'SKAR'} // Skar, Mink, Necrimancer, Rogue, Shaman
    ],
    roleOptions: [
      {value: 'Crowd Control', text: 'CROWD CONTROL'},
      {value: 'Healer', text: 'HEALER'},
      {value: 'Melee Dps', text: 'MELEE DPS'},
      {value: 'Off Tank', text: 'OFF TANK'},
      {value: 'Ranged Dps', text: 'RANGED DPS'},
      {value: 'Support', text: 'SUPPORT'},
      {value: 'Tank', text: 'TANK'},
      {value: 'Utility', text: 'UTILITY'},     
    ],
    classOptions: {
      'Crowd Control': [{value: 'Enchanter', text: 'ENCHANTER'}, ],
      'Melee Dps':     [{value: 'Monk', text: 'MONK'}, {value: 'Ranger', text: 'RANGER'}, {value: 'Rogue', text: 'ROGUE'}],
      'Off Tank':      [{value: 'Monk', text: 'MONK'}],
      'Ranged Dps':    [{value: 'Ranger', text: 'RANGER'}, {value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Wizard', text: 'WIZARD'}],
      'Healer':        [{value: 'Cleric', text: 'CLERIC'}, {value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
      'Tank':          [{value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Paladin', text: 'PALADIN'}, {value: 'Warrior', text: 'WARRIOR'}],
      'Support':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}, {value: 'Druid', text: 'DRUID'}, {value: 'Shaman', text: 'SHAMAN'}],
      'Utility':       [{value: 'Bard', text: 'BARD'}, {value: 'Cleric', text: 'CLERIC'}, {value: 'Dire Lord', text: 'DIRE LORD'}, {value: 'Druid', text: 'DRUID'}, {value: 'Enchanter', text: 'ENCHANTER'}, {value: 'Monk', text: 'MONK'}, {value: 'Necormancer', text: 'NECROMANCER'}, {value: 'Paladin', text: 'PALADIN'}, {value: 'Ranger', text: 'RANGER'}, {value: 'Rogue', text: 'ROGUE'}, {value: 'Shaman', text: 'SHAMAN'}, {value: 'Summoner', text: 'SUMMONER'}, {value: 'Warrior', text: 'WARRIOR'}, {value: 'Wizard', text: 'WIZARD'}]
    },
      // {value: 'Cleric', text: 'CLERIC'},
      // {value: 'Dire Lord', text: 'DIRE LORD'},
      // {value: 'Druid', text: 'DRUID'},
      // {value: 'Enchanter', text: 'ENCHANTER'},
      // {value: 'Monk', text: 'MONK'},
      // {value: 'Paladin', text: 'PALADIN'},
      // {value: 'Ranger', text: 'RANGER'},
      // {value: 'Rogue', text: 'ROGUE'},
      // {value: 'Shaman', text: 'SHAMAN'},
      // {value: 'Summoner', text: 'SUMMONER'},
      // {value: 'Warrior', text: 'WARRIOR'},
      // {value: 'Wizard', text: 'WIZARD'}
    professionOptions: [
      {value: 'Alchemist',   text: 'ALCHEMIST'},
      {value: 'Blacksmith',  text: 'BLACKSMITH'},
      {value: 'Outfitter',   text: 'OUTFITTER'},
      {value: 'Provisioner', text: 'PROVISIONER'},
      {value: 'Scribe',      text: 'SCRIBE'},
      {value: 'Stonemason',  text: 'STONEMASON'},
      {value: 'Woodworker',  text: 'WOODWORKER'},
    ],
    professionSpecializationOptions: {
      Alchemist:   [],
      Blacksmith:  [{value: 'Armorsmith', text: 'ARMORSMITH'}, {value: 'Weaponsmith',   text: 'WEAPONSMITH'}],
      Outfitter:   [{value: 'Leatherworker', text: 'LEATHERWORKER'}, {value: 'Tailor',     text: 'TAILOR'}],
      Provisioner: [{value: 'Brewer',        text: 'BREWER'},        {value: 'Chef',       text: 'CHEF'}],
      Scribe:      [{value: 'Engraver',      text: 'ENGRAVER'},      {value: 'Researcher', text: 'RESEARCHER'}],
      Stonemason:  [{value: 'Jeweller',      text: 'JEWELLER'},      {value: 'Sculptor',   text: 'SCULPTOR'}],
      Woodworker:  [{value: 'Bowyer',        text: 'BOWYER'},        {value: 'Carver',     text: 'CARVER'}],
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
    const {token, id, username, email, firstName, lastName, profileImage, isSuperUser, isStaff, dateJoined, lastLogin, bio, primaryRace, primaryRole, primaryClass, secondaryRace, secondaryRole, secondaryClass, profession, professionSpecialization, discordUrl, twitterUrl, twitchUrl, youtubeUrl, experiencePoints} = props.User
    /*Validate Data*/
    // const primaryRole = props.User.primaryRole ? props.User.primaryRole : props.defaultRole
    // const primaryClass = props.User.primaryClass ? props.User.primaryClass : props.defaultClass
    // const secondaryClass = props.User.secondaryClass ? props.User.secondaryClass : props.defaultClass
    // const secondaryRole = props.User.secondaryRole ? props.User.secondaryRole : props.defaultRole
    // const profession = props.User.profession ? props.User.profession : props.defaultProfession
    // const professionSpecialization = props.User.professionSpecialization ? props.User.professionSpecialization : props.defaultProfessionSpecialization
    const {password} = this.state
    this.setState({token, id, username, password, email, firstName, lastName, profileImage, isSuperUser, isStaff, dateJoined, lastLogin, bio, primaryRace, primaryRole, primaryClass, secondaryRace, secondaryRole, secondaryClass, profession, professionSpecialization, dateJoined, discordUrl, twitterUrl, twitchUrl, youtubeUrl, experiencePoints})
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

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

  renderOptions = Options => Options ? Options.map(option => <option value={option.value}>{option.text}</option>) : this.defaultOption()

  updateProfile = () => {
    const {token, id, username, email, firstName, lastName, profileImage, bio, primaryRace, primaryRole, primaryClass, secondaryRace, secondaryRole, secondaryClass, profession, professionSpecialization, discordUrl, twitterUrl, twitchUrl, youtubeUrl} = this.state
    const payload ={
      username, email, first_name: firstName, last_name: lastName, bio,
      primary_race: primaryRace, primary_role: primaryRole, primary_class: primaryClass,
      secondary_race: secondaryRace, secondary_role: secondaryRole, secondary_class: secondaryClass,
      profession, profession_specialization: professionSpecialization,
      discord_url: discordUrl, twitter_url: twitterUrl, twitch_url: twitchUrl, youtube_url: youtubeUrl
    }
    this.props.updateProfile(id, payload)
  }

  defaultOption = () => <option disabled value="">SELECT</option>

  render() {
    const {raceOptions, raceRoleClassOptions, roleOptions, classOptions, professionOptions, professionSpecializationOptions} = this.props
    const canSubmit = !this.cantSubmit()
    const {token, id, username, password, email, firstName, lastName, profileImage, isSuperUser, isStaff, dateJoined, lastLogin, bio, primaryRace, primaryRole, primaryClass, secondaryRace, secondaryRole, secondaryClass, profession, professionSpecialization, discordUrl, twitterUrl, twitchUrl, youtubeUrl, experiencePoints} = this.state
    return (
      !token ? <Redirect to={this.props.history.push('/login')}/>
      :<Grid className="Profile Container">
        <Row>
          <PageHeader className="pageHeader">PROFILE</PageHeader>
        </Row>
        <Row>
          <Col md={4}><h3>Experience Points: {experiencePoints}</h3></Col>
          <Col md={4}><h3>Joined:  <Moment format="MMMM DD, YYYY">{dateJoined}</Moment></h3></Col>
          <Col md={4}><h3>Last Login:  <Moment fromNow>{lastLogin}</Moment></h3></Col>
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
          { /* <FormGroup>
                <ControlLabel>Profile picture</ControlLabel>
                <FormControl type="file" label="File" name="profile_image" onChange={this.setImage} help="Example block-level help text here."/>
              </FormGroup> */}
              <Col md={6}>
              <FormGroup>
                <ControlLabel>First Name</ControlLabel>
                <FormControl value={firstName} type="text" name="firstName" placeholder="First Name" onChange={this.onChange}/>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <ControlLabel>Last Name</ControlLabel>
                <FormControl value={lastName} type="text" name="lastName" placeholder="Last Name" onChange={this.onChange}/>
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
              <FormGroup>
                <ControlLabel>Race</ControlLabel>
                <FormControl value={primaryRace} name="primaryRace" componentClass="select" onChange={this.onChange} id="dropDown">
                  {this.defaultOption()}  
                  {this.renderOptions(raceOptions)}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>Role</ControlLabel>
                <FormControl value={primaryRole} name="primaryRole" componentClass="select" onChange={this.onChange} id="dropDown" disabled={!primaryRace}>
                  {primaryRace ? [this.defaultOption(), this.renderOptions(raceRoleClassOptions[primaryRace].roleOptions)] : null}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>Class</ControlLabel>
                <FormControl value={primaryClass} name="primaryClass" componentClass="select" onChange={this.onChange} id="dropDown" disabled={!primaryRole}>
                  {primaryRace ? [this.defaultOption(), this.renderOptions(raceRoleClassOptions[primaryRace].classOptions[primaryRole])] : null}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={12}><h3>SECONDARY</h3></Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>Race</ControlLabel>
                <FormControl value={secondaryRace} name="secondaryRace" componentClass="select" onChange={this.onChange} id="dropDown">
                  {[this.defaultOption(), this.renderOptions(raceOptions)]}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>Role</ControlLabel>
                <FormControl value={secondaryRole} name="secondaryRole" componentClass="select" onChange={this.onChange} id="dropDown" disabled={!secondaryRace}>
                {secondaryRace ? [this.defaultOption(), this.renderOptions(raceRoleClassOptions[secondaryRace].roleOptions)] : null}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>Class</ControlLabel>
                <FormControl value={secondaryClass} name="secondaryClass" componentClass="select" onChange={this.onChange} id="dropDown" disabled={!secondaryRole}>
                  {secondaryRace ? [this.defaultOption(), this.renderOptions(raceRoleClassOptions[secondaryRace].classOptions[secondaryRole])] : null}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={12}><h3>CRAFTING</h3></Col>
            <Col md={6}>
              <FormGroup >
                <ControlLabel>Profession</ControlLabel>
                <FormControl value={profession} name="profession" componentClass="select" onChange={this.onChange} id="dropDown">
                  {[this.defaultOption(), this.renderOptions(professionOptions)]}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <ControlLabel>Specialization</ControlLabel>
                <FormControl value={professionSpecialization} name="professionSpecialization" componentClass="select" onChange={this.onChange} id="dropDown" disabled={!profession}>
                  {[this.defaultOption(), this.renderOptions(professionSpecializationOptions[profession])]}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={12}><h3>CONNECTIONS</h3></Col>
            <Col md={3}>
              <FormGroup>
                <ControlLabel>Discord</ControlLabel>
                <FormControl value={discordUrl} name="discordUrl" type="text"  onChange={this.onChange}>
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <ControlLabel>Twitch</ControlLabel>
                <FormControl value={twitchUrl} name="twitchUrl" type="text" onChange={this.onChange}>
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <ControlLabel>Twitter</ControlLabel>
                <FormControl value={twitterUrl} name="twitterUrl" type="text" onChange={this.onChange}>
                </FormControl>
              </FormGroup>
            </Col>
            
            <Col md={3}>
              <FormGroup>
                <ControlLabel>YouTube</ControlLabel>
                <FormControl value={youtubeUrl} name="youtubeUrl" type="text"  onChange={this.onChange}>
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