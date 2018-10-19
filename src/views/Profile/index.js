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

/*clearIndicator container control dropdownIndicator 
group groupHeading indicatorsContainer indicatorSeparator 
input loadingIndicator loadingMessage menu menuList multiValue 
multiValueLabel multiValueRemove noOptionsMessage option placeholder singleValue valueContainer */
const selectStyles = {
  menu: (base, state) => ({
    ...base,
    backgroundColor: 'var(--grey)',
  }),
  container: (base, state) => ({
    ...base,
    opacity: state.isDisabled ? '.5' : '1',
    backgroundColor: 'var(--grey)'
  }),
  clearIndicator: (base, state) => ({
    ...base,
    color: 'var(--tertiarycolor)'
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: 'var(--tertiarycolor)'
  }),
  control: (base, state) => ({
    ...base,
    backgroundColor: 'var(--grey)',
  }),
  option: (base, state) => ({
    ...base,
    borderBottom: '1px solid var(--primaryColor)',
    borderRadius: '4px',
    background: state.isFocused ? 'var(--primaryColor)' : 'var(--grey)',
    color: 'white'
  }),
  singleValue: (base, state) => ({
    ...base,
    color: 'var(--tertiarycolor)'
  }),
  placeholder: (base, state) => ({
    ...base,
    color: 'var(--tertiarycolor)'
  }),
  valueContainer: (base, state) => ({
    ...base,
    backgroundColor: 'var(--grey)'
  })
}

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

  renderOptions = Options => Options ? Options.map(option => <option value={option.value}>{option.label}</option>) : this.defaultOption()

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
          <Col md={4}><h3>Experience Points: {experiencePoints} / 10000<progress value={experiencePoints} min="0" max="10000"></progress></h3></Col>
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
            <ControlLabel>RACE</ControlLabel>
            <Select
              value={primaryRace ? {value: primaryRace, label: primaryRace} : null}
              onChange={(Race) => this.setState({primaryRace: Race ? Race.value : ''})}
              options={raceOptions}
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </Col>
          <Col md={4}>
            <ControlLabel>ROLE</ControlLabel>
            <Select
              value={primaryRole ? {value: primaryRole, label: primaryRole} : null}
              onChange={(Role) => this.setState({primaryRole: Role ? Role.value : ''})}
              options={primaryRace ? raceRoleClassOptions[primaryRace].roleOptions : []}
              isClearable
              isSearchable
              isDisabled={!primaryRace}
              styles={selectStyles}
              />
          </Col>
          <Col md={4}>
            <ControlLabel>CLASS</ControlLabel>
            <Select
              value={primaryClass ? {value: primaryClass, label: primaryClass} : null}
              onChange={(Class) => this.setState({primaryClass: Class ? Class.value : ''})}
              options={primaryRace ? raceRoleClassOptions[primaryRace].classOptions[primaryRole] : []}
              isClearable
              isSearchable
              isDisabled={!primaryRole}
              styles={selectStyles}
              />
          </Col>
          <Col md={12}><h3>SECONDARY</h3></Col>
            <Col md={4}>
              <ControlLabel>RACE</ControlLabel>
              <Select
                value={secondaryRace ? {value: secondaryRace, label: secondaryRace} : null}
                onChange={(Race) => this.setState({secondaryRace: Race ? Race.value : ''})}
                options={raceOptions}
                isClearable
                isSearchable
                styles={selectStyles}
              />
            </Col>
            <Col md={4}>
              <ControlLabel>ROLE</ControlLabel>
              <Select
                value={secondaryRole ? {value: secondaryRole, label: secondaryRole} : null}
                onChange={(Role) => this.setState({secondaryRole: Role ? Role.value : ''})}
                options={secondaryRace ? raceRoleClassOptions[secondaryRace].roleOptions : []}
                isClearable
                isSearchable
                isDisabled={!secondaryRace}
                styles={selectStyles}
                />
            </Col>
            <Col md={4}>
              <ControlLabel>CLASS</ControlLabel>
              <Select
                value={secondaryClass ? {value: secondaryClass, label: secondaryClass} : null}
                onChange={(Class) => this.setState({secondaryClass: Class ? Class.value : ''})}
                options={secondaryRace ? raceRoleClassOptions[secondaryRace].classOptions[secondaryRole] : []}
                isClearable
                isSearchable
                isDisabled={!secondaryRole}
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
                value={professionSpecialization ? {value: professionSpecialization, label: professionSpecialization} : null}
                onChange={(ProfessionSpecialization) => this.setState({professionSpecialization: ProfessionSpecialization ? ProfessionSpecialization.value : ''})}
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