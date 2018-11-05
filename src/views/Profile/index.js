import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, PageHeader, Form, FormGroup, FormControl, ControlLabel, Button, Image} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import Moment from 'react-moment'
import {updateProfile} from '../../actions/User'
import Select from 'react-select'
import './styles.css'
import './stylesM.css'
import {selectStyles} from '../../helpers/styles'
import FormData from 'form-data'
import { withAlert } from 'react-alert'

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
    const {token, id, profile_image, username, email, first_name, last_name, is_superuser, is_staff, date_joined, last_login, bio, primary_race, primary_role, primary_class, secondary_race, secondary_role, secondary_class, profession, profession_specialization, discord_url, twitter_url, twitch_url, youtube_url, experience_points} = this.state.token ? this.state : props.User
    const {password} = this.state
    this.setState({token, id, username, password, email, first_name, last_name, profile_image, is_superuser, is_staff, date_joined, last_login, bio, primary_race, primary_role, primary_class, secondary_race, secondary_role, secondary_class, profession, profession_specialization, date_joined, discord_url, twitter_url, twitch_url, youtube_url, experience_points})
  }

  onChange = e => this.setState({[e.target.name]: e.target.value})

  selectOnChange = (e, a, name) => {
    switch(a.action) {
      case 'clear':
        if (name.includes('primary')) this.setState({primary_race: '', primary_role: '', primary_class: ''})
        else if (name.includes('secondary')) this.setState({secondary_race: '', secondary_role: '', secondary_class: ''})
        else if (name.includes('profession')) this.setState({profession: '', profession_specialization: ''})
        break;
      case 'select-option':
        switch (name) {
          case 'primary_race':
            this.setState({[name]: e.value, primary_role: '', primary_class: ''})
            break;
          case 'primary_role':
            this.setState({[name]: e.value, primary_class: ''})
            break;
          case 'primary_class':
            this.setState({[name]: e.value})
            break;
            case 'secondary_race':
            this.setState({[name]: e.value, secondary_role: '', secondary_class: ''})
            break;
          case 'secondary_role':
            this.setState({[name]: e.value, secondary_class: ''})
            break;
          case 'secondary_class':
            this.setState({[name]: e.value})
            break;
          case 'profession':
            this.setState({[name]: e.value, profession_specialization: ''})
            break;
          case 'profession_specialization':
            this.setState({[name]: e.value})
            break;
        }
    }
  }

  setImage = e => {
    const {alert} = this.props
    var file = e.target.files[0]
    if(file.size > 5242880) {
      alert.error(<div>Please use an image less then 5MB</div>)
    }else {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => this.setState({profile_image: reader.result})
    }
}
  
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

  updateProfile = () => {
    const {token, id, username, email, first_name, last_name, profile_image, bio, primary_race, primary_role, primary_class, secondary_race, secondary_role, secondary_class, profession, profession_specialization, discord_url, twitter_url, twitch_url, youtube_url} = this.state
    
    let payload = new FormData()
    // payload.append('profile_image', profile_image, profile_image.fileName)
    payload.append('profile_image', profile_image)
    payload.append('username', username)
    payload.append('email', email)
    payload.append('first_name', first_name)
    payload.append('last_name', last_name)
    payload.append('bio', bio)
    payload.append('primary_race', primary_race)
    payload.append('primary_role', primary_role)
    payload.append('primary_class', primary_class)
    payload.append('secondary_race', secondary_race)
    payload.append('secondary_role', secondary_role)
    payload.append('secondary_class', secondary_class)
    payload.append('profession', profession)
    payload.append('profession_specialization', profession_specialization)
    payload.append('discord_url', discord_url)
    payload.append('twitter_url', twitter_url)
    payload.append('twitch_url', twitch_url)
    payload.append('youtube_url', youtube_url)
    
    this.props.updateProfile(id, token, payload)
  }

  render() {
    const {raceOptions, raceRoleClassOptions, roleOptions, classOptions, professionOptions, professionSpecializationOptions} = this.props
    const canSubmit = !this.cantSubmit()
    const {token, id, username, password, email, first_name, last_name, profile_image, is_superuser, is_staff, date_joined, last_login, bio, primary_race, primary_role, primary_class, secondary_race, secondary_role, secondary_class, profession, profession_specialization, discord_url, twitter_url, twitch_url, youtube_url, experience_points} = this.state
    return (
      !token ? <Redirect to={this.props.history.push('/login')}/>
      :<Grid className="Profile Container fadeIn-2">
        <Row>
          <PageHeader className="pageHeader">PROFILE</PageHeader>
        </Row>
        <Row>
          <h2 className="headerBanner">ACCOUNT</h2>
        </Row>
        <Row>
          <Col md={4}>
            <Image src={profile_image} style={{maxHeight: '250px'}} responsive rounded/>
            <ControlLabel>Profile Picture</ControlLabel>
            <FormControl type="file" label="File" name="profile_image" onChange={this.setImage} />
          </Col>
          <Col md={4} xs={6} className="borderCol"><h3>Joined:  <Moment format="MMMM DD, YYYY">{date_joined}</Moment></h3></Col>
          <Col md={4} xs={6}><h3>Last Login:  <Moment fromNow>{last_login}</Moment></h3></Col>
          <Col xs={12}><h2><progress value={experience_points} min="0" max="10000"></progress></h2></Col>
          <Col md={3}>
            <FormGroup validationState={this.validateUsername()}>
              <ControlLabel>Username</ControlLabel>
              <FormControl value={username} type="text" name="username" placeholder="Username" onChange={this.onChange}/>
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup validationState={this.validatePassword()}>
              <ControlLabel>Password</ControlLabel>
              <FormControl value={password} type="password" name="password" placeholder="Password" onChange={this.onChange}/>
              <FormControl.Feedback />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup validationState={this.validateEmail()}>
              <ControlLabel>Email</ControlLabel>
              <FormControl value={email} type="email" name="email" placeholder="Email" onChange={this.onChange}/>
            </FormGroup>
          </Col>
          <Col md={2} sm={6}>
            <FormGroup>
              <ControlLabel>First Name</ControlLabel>
              <FormControl value={first_name} type="text" name="first_name" placeholder="First Name" onChange={this.onChange}/>
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Last Name</ControlLabel>
              <FormControl value={last_name} type="text" name="last_name" placeholder="Last Name" onChange={this.onChange}/>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>Biography</ControlLabel>
              <FormControl value={bio} componentClass="textarea" type="textarea" name="bio" placeholder="Bio" onChange={this.onChange}/>
            </FormGroup>
          </Col>
        </Row>
        <Row><h2 className="headerBanner">CONNECTIONS</h2></Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Discord</ControlLabel>
              <FormControl value={discord_url} name="discord_url" type="text"  onChange={this.onChange} />
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
              <FormControl value={twitter_url} name="twitter_url" type="text" onChange={this.onChange} />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <ControlLabel>YouTube</ControlLabel>
              <FormControl value={youtube_url} name="youtube_url" type="text"  onChange={this.onChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row><h2 className="headerBanner">PRIMARY</h2></Row>
        <Row>
          <Col md={4}>
          <ControlLabel>RACE</ControlLabel>
          <Select
            value={primary_race ? {value: primary_race, label: primary_race} : null}
            onChange={(e, a) => this.selectOnChange(e, a, 'primary_race')}
            options={raceOptions}
            isClearable={true}
            isSearchable={true}
            onBlur={e => e.preventDefault()}
            blurInputOnSelect={false}
            styles={selectStyles}
          />
        </Col>
        <Col md={4}>
          <ControlLabel>ROLE</ControlLabel>
          <Select
            value={primary_role ? {value: primary_role, label: primary_role} : null}
            onChange={(e, a) => this.selectOnChange(e, a, 'primary_role')}
            options={primary_race ? raceRoleClassOptions[primary_race].roleOptions : []}
            isClearable={true}
            isSearchable={true}
            onBlur={e => e.preventDefault()}
            blurInputOnSelect={false}
            isDisabled={!primary_race}
            styles={selectStyles}
            />
        </Col>
        <Col md={4}>
          <ControlLabel>CLASS</ControlLabel>
          <Select
            value={primary_class ? {value: primary_class, label: primary_class} : null}
            onChange={(e, a) => this.selectOnChange(e, a, 'primary_class')}
            options={primary_race ? raceRoleClassOptions[primary_race].classOptions[primary_role] : []}
            isClearable={true}
            isSearchable={true}
            onBlur={e => e.preventDefault()}
            blurInputOnSelect={false}
            isDisabled={!primary_role}
            styles={selectStyles}
            />
        </Col>
        </Row>
        <Row><h2 className="headerBanner">SECONDARY</h2></Row>
        <Row>
          <Col md={4}>
            <ControlLabel>RACE</ControlLabel>
            <Select
              value={secondary_race ? {value: secondary_race, label: secondary_race} : null}
              onChange={(e, a) => this.selectOnChange(e, a, 'secondary_race')}
              options={raceOptions}
              isClearable={true}
              isSearchable={true}
              onBlur={e => e.preventDefault()}
              blurInputOnSelect={false}
              styles={selectStyles}
            />
          </Col>
          <Col md={4}>
            <ControlLabel>ROLE</ControlLabel>
            <Select
              value={secondary_role ? {value: secondary_role, label: secondary_role} : null}
              onChange={(e, a) => this.selectOnChange(e, a, 'secondary_role')}
              options={secondary_race ? raceRoleClassOptions[secondary_race].roleOptions : []}
              isClearable={true}
              isSearchable={true}
              onBlur={e => e.preventDefault()}
              blurInputOnSelect={false}
              isDisabled={!secondary_race}
              styles={selectStyles}
              />
          </Col>
          <Col md={4}>
            <ControlLabel>CLASS</ControlLabel>
            <Select
              value={secondary_class ? {value: secondary_class, label: secondary_class} : null}
              onChange={(e, a) => this.selectOnChange(e, a, 'secondary_class')}
              options={secondary_race ? raceRoleClassOptions[secondary_race].classOptions[secondary_role] : []}
              isClearable={true}
              isSearchable={true}
              onBlur={e => e.preventDefault()}
              blurInputOnSelect={false}
              isDisabled={!secondary_role}
              styles={selectStyles}
              />
          </Col>
        </Row>
        <Row><h2 className="headerBanner">CRAFTING</h2></Row>
        <Row>
          <Col md={6}>
            <ControlLabel>Profession</ControlLabel>
            <Select
              value={profession ? {value: profession, label: profession} : null}
              onChange={(e, a) => this.selectOnChange(e, a, 'profession')}
              options={professionOptions}
              isClearable={true}
              isSearchable={true}
              onBlur={e => e.preventDefault()}
              blurInputOnSelect={false}
              styles={selectStyles}
              />
          </Col>
          <Col md={6}>
            <ControlLabel>Specialization</ControlLabel>
            <Select
              value={profession_specialization ? {value: profession_specialization, label: profession_specialization} : null}
              onChange={(e, a) => this.selectOnChange(e, a, 'profession_specialization')}
              options={professionSpecializationOptions[profession]}
              isClearable={true}
              isSearchable={true}
              onBlur={e => e.preventDefault()}
              blurInputOnSelect={false}
              isDisabled={!profession}
              styles={selectStyles}
              />
          </Col>
          <Col md={12} style={{textAlign: 'center', margin: '20px'}}>
            <Button onClick={this.updateProfile} disabled={canSubmit}>Update</Button>
          </Col>
        </Row>
       </Grid>
    )
  }
}
export default withAlert(reduxConnect(mapStateToProps, mapDispatchToProps)(Profile))