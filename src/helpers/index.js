import React from 'react'
import Bard from '../images/classIcons/bard.png'
import Cleric from '../images/classIcons/cleric.png'
import Paladin from '../images/classIcons/paladin.png'
import Warrior from '../images/classIcons/warrior.png'
import DireLord from '../images/classIcons/dire-lord.png'
import Ranger from '../images/classIcons/ranger.png'
import Rogue from '../images/classIcons/rogue.png'
import Monk from '../images/classIcons/monk.png'
import Summoner from '../images/classIcons/summoner.png'
import Enchanter from '../images/classIcons/enchanter.png'
import Wizard from '../images/classIcons/wizard.png'
import Druid from '../images/classIcons/druid.png'
import Shaman from '../images/classIcons/shaman.png'
import Default from '../images/classIcons/default.png'
import QuestionMark from '../images/question.png'

  /**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false
    }
    return true
}

export const checkNestedProps = (obj, level1) => {
    var args = Array.prototype.slice.call(arguments, 1)
  
    for (var i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false
      }
      obj = obj[args[i]]
    }
    return true
}

export const statusLevelInt = status => {
    if (status.is_leader) return 7
    if (status.is_council) return 6
    if (status.is_general_officer) return 5
    if (status.is_officer) return 4
    if (status.is_senior_member) return 3
    if (status.is_junior_member) return 2
    if (status.is_recruit) return 1
    return 0
}

export const statusLevelString = status => {
    switch(status) {
        case 7: return 'Leader'
        case 6: return 'Council'
        case 5: return 'General Officer'
        case 4: return 'Officer'
        case 3: return 'Senior Member'
        case 2: return 'Junior Member'
        case 1: return 'Recruit'
        default: return 'Guest'
    }
}

export const classIcon = primaryClass => {
    switch (primaryClass) {
        case 'Bard': return Bard
        case 'Cleric': return Cleric
        case 'Paladin': return Paladin
        case 'Warrior': return Warrior
        case 'Dire Lord': return DireLord
        case 'Ranger': return Ranger
        case 'Rogue': return Rogue
        case 'Monk': return Monk
        case 'Summoner': return Summoner
        case 'Enchanter': return Enchanter
        case 'Wizard': return Wizard
        case 'Druid': return Druid
        case 'Shaman': return Shaman
        default: return null
      }
}

export const professionIcon = (profession, professionSpecialization) => {
    if(professionSpecialization) {
        switch (profession) {
            case 'Alchemist': return <i class="fas fa-vial"/>
            case 'Blacksmith': return <i class="fas fa-hammer"/>
            case 'Outfitter': return <i class="fas fa-tshirt"/>
            case 'Provisioner': return <i class="fas fa-lemon"/>
            case 'Scribe': return <i class="fas fa-scroll"/>
            case 'Stonemason': return <i class="fas fa-hand-rock"/>
            case 'Woodworker':return <i class="fas fa-tree"/>
            default: return null
        }
     }
     else {
        switch (profession) {
            case 'Armorsmith': return <i class="fab fa-css3"/>
            case 'Weaponsmith': return <i class="fab fa-ethereum"/>
            case 'Leatherworker': return <i class="fab fa-pied-piper-hat"/>
            case 'Tailor': return <i class="fab fa-opencart"/>
            case 'Brewer': return <i class="fas fa-beer"/>
            case 'Chef': return <i class="fas fa-utensils"/>
            case 'Engraver': return <i class="fas fa-pen-fancy"/>
            case 'Researcher': return <i class="fas fa-hat-wizard"/>
            case 'Jeweller': return <i class="fas fa-ring"/>
            case 'Sculptor': return <i class="fas fa-monument"/>
            case 'Bowyer': return <i class="fab fa-schlix"/>
            case 'Carver': return <i class="fas fa-hands"/>
            default: return null
        }
    }
}

export const hasDeletePermission = (User, author, tags) => {
    if(tags.includes('Article')) {
      if(User.is_superuser) return true
      if(User.is_staff && User.can_delete_article) return true
      if(User.id == author || User.can_delete_article) return true
    }

    if(tags.includes('Newsletter')) {
      if(User.is_superuser) return true
      if(User.is_staff && User.can_delete_newsletter) return true
      if(User.id == author || User.can_delete_newsletter) return true
    }
    
    return false
  }

export const hasUpdatePermission = (User, author, tags) => {
    if(tags.includes('Article')) {
      if(User.is_superuser) return true
      if(User.is_staff && User.can_update_article) return true
      if(User.id == author || User.can_update_article) return true
    }

    if(tags.includes('Newsletter')) {
      if(User.is_superuser) return true
      if(User.is_staff && User.can_update_newsletter) return true
      if(User.id == author || User.can_update_newsletter) return true
    }
    
    return false
  }