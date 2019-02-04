import React from "react";
import { Redirect } from "react-router-dom";

import Bard from "../images/classIcons/bard.png";
import Cleric from "../images/classIcons/cleric.png";
import Paladin from "../images/classIcons/paladin.png";
import Warrior from "../images/classIcons/warrior.png";
import DireLord from "../images/classIcons/dire-lord.png";
import Ranger from "../images/classIcons/ranger.png";
import Rogue from "../images/classIcons/rogue.png";
import Monk from "../images/classIcons/monk.png";
import Summoner from "../images/classIcons/summoner.png";
import Enchanter from "../images/classIcons/enchanter.png";
import Wizard from "../images/classIcons/wizard.png";
import Druid from "../images/classIcons/druid.png";
import Shaman from "../images/classIcons/shaman.png";
import Default from "../images/classIcons/default.png";
import QuestionMark from "../images/question.png";

export const objectToArray = obj => Object.keys(obj).map(key => obj[key]);

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getImageBase64 = image => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const checkNestedProps = (obj, level1) => {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
};

export const statusLevelInt = User => {
  const {
    id,
    is_leader,
    is_advisor,
    is_council,
    is_general_officer,
    is_officer,
    is_senior_member,
    is_junior_member,
    is_recruit
  } = User;

  if (id === 1) return 9;
  if (is_leader) return 8;
  if (is_advisor) return 7;
  if (is_council) return 6;
  if (is_general_officer) return 5;
  if (is_officer) return 4;
  if (is_senior_member) return 3;
  if (is_junior_member) return 2;
  if (is_recruit) return 1;
  return 0;
};

export const statusLevelString = status => {
  switch (status) {
    case 8:
      return "Leader";
    case 7:
      return "Advisor";
    case 6:
      return "Council";
    case 5:
      return "General Officer";
    case 4:
      return "Officer";
    case 3:
      return "Senior Member";
    case 2:
      return "Junior Member";
    case 1:
      return "Recruit";
    default:
      return "Guest";
  }
};

export const classIcon = primaryClass => {
  switch (primaryClass) {
    case "Bard":
      return Bard;
    case "Cleric":
      return Cleric;
    case "Paladin":
      return Paladin;
    case "Warrior":
      return Warrior;
    case "Dire Lord":
      return DireLord;
    case "Ranger":
      return Ranger;
    case "Rogue":
      return Rogue;
    case "Monk":
      return Monk;
    case "Summoner":
      return Summoner;
    case "Enchanter":
      return Enchanter;
    case "Wizard":
      return Wizard;
    case "Druid":
      return Druid;
    case "Shaman":
      return Shaman;
    default:
      return null;
  }
};

export const professionIcon = (profession, professionSpecialization) => {
  if (professionSpecialization) {
    switch (profession) {
      case "Alchemist":
        return <i className="fas fa-vial" />;
      case "Blacksmith":
        return <i className="fas fa-hammer" />;
      case "Outfitter":
        return <i className="fas fa-tshirt" />;
      case "Provisioner":
        return <i className="fas fa-lemon" />;
      case "Scribe":
        return <i className="fas fa-scroll" />;
      case "Stonemason":
        return <i className="fas fa-hand-rock" />;
      case "Woodworker":
        return <i className="fas fa-tree" />;
      default:
        return null;
    }
  } else {
    switch (profession) {
      case "Armorsmith":
        return <i className="fab fa-css3" />;
      case "Weaponsmith":
        return <i className="fab fa-ethereum" />;
      case "Leatherworker":
        return <i className="fab fa-pied-piper-hat" />;
      case "Tailor":
        return <i className="fab fa-opencart" />;
      case "Brewer":
        return <i className="fas fa-beer" />;
      case "Chef":
        return <i className="fas fa-utensils" />;
      case "Engraver":
        return <i className="fas fa-pen-fancy" />;
      case "Researcher":
        return <i className="fas fa-hat-wizard" />;
      case "Jeweller":
        return <i className="fas fa-ring" />;
      case "Sculptor":
        return <i className="fas fa-monument" />;
      case "Bowyer":
        return <i className="fab fa-schlix" />;
      case "Carver":
        return <i className="fas fa-hands" />;
      default:
        return null;
    }
  }
};

export const hasDeletePermission = (User, author, tags) => {
  if (User.is_superuser) return true;

  if (tags.includes("Article")) {
    if (User.is_staff && User.can_delete_article) return true;
    if (User.id == author || User.can_delete_article) return true;
  }

  if (tags.includes("Newsletter")) {
    if (User.is_staff && User.can_delete_newsletter) return true;
    if (User.id == author || User.can_delete_newsletter) return true;
  }

  return false;
};

export const hasUpdatePermission = (User, author, tags) => {
  if (User.is_superuser) return true;

  if (tags.includes("Article")) {
    if (User.is_staff && User.can_update_article) return true;
    if (User.id == author || User.can_update_article) return true;
  }

  if (tags.includes("Newsletter")) {
    if (User.is_staff && User.can_update_newsletter) return true;
    if (User.id == author || User.can_update_newsletter) return true;
  }

  return false;
};

export const isSubset = (arr1, arr2) => {
  const hset = new Map();

  // hset stores all the values of arr1
  for (let i = 0; i < arr1.length; i++) {
    if (!hset.has(arr1[i])) hset.set(arr1[i]);
  }

  // loop to check if all elements of arr2 also
  // lies in arr1
  for (let i = 0; i < arr2.length; i++) {
    if (!hset.has(arr2[i])) return false;
  }
  return true;
};

export const isEquivalent = (obj1, obj2) => {
  // Create arrays of property names
  const obj1Props = Object.getOwnPropertyNames(obj1);
  const obj2Props = Object.getOwnPropertyNames(obj2);

  // If number of properties is different,
  // objects are not equivalent
  if (obj1Props.length != obj2Props.length) {
    return false;
  }

  for (var i = 0; i < obj1Props.length; i++) {
    var propName = obj1Props[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (obj1[propName] !== obj2[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};

export const raceRoleClassOptions = {
  Archai: {
    // Bard, Druid, Monk, Shaman, Warrior, Wizard
    roleOptions: [
      { value: "Healer", label: "Healer" },
      { value: "Melee Dps", label: "Melee Dps" },
      { value: "Off Tank", label: "Off Tank" },
      { value: "Ranged Dps", label: "Ranged Dps" },
      { value: "Support", label: "Support" },
      { value: "Tank", label: "Tank" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      Healer: [
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" }
      ],
      "Melee Dps": [{ value: "Monk", label: "Monk" }],
      "Off Tank": [{ value: "Monk", label: "Monk" }],
      "Ranged Dps": [{ value: "Wizard", label: "Wizard" }],
      Support: [
        { value: "Bard", label: "Bard" },
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" }
      ],
      Tank: [{ value: "Warrior", label: "Warrior" }],
      Utility: [
        { value: "Bard", label: "Bard" },
        { value: "Druid", label: "Druid" },
        { value: "Enchanter", label: "Enchanter" },
        { value: "Monk", label: "Monk" },
        { value: "Shaman", label: "Shaman" },
        { value: "Warrior", label: "Warrior" },
        { value: "Wizard", label: "Wizard" }
      ]
    }
  },
  "Dark Myr": {
    // Bard, Cleric, Dire Lord, Druid, Enchanter, Monk, Necromancer, Rogue, Summoner, Warrior, Wizard
    roleOptions: [
      { value: "Crowd Control", label: "Crowd Control" },
      { value: "Healer", label: "Healer" },
      { value: "Melee Dps", label: "Melee Dps" },
      { value: "Off Tank", label: "Off Tank" },
      { value: "Ranged Dps", label: "Ranged Dps" },
      { value: "Support", label: "Support" },
      { value: "Tank", label: "Tank" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      "Crowd Control": [{ value: "Enchanter", label: "Enchanter" }],
      Healer: [
        { value: "Cleric", label: "Cleric" },
        { value: "Druid", label: "Druid" }
      ],
      "Melee Dps": [
        { value: "Monk", label: "Monk" },
        { value: "Rogue", label: "Rogue" }
      ],
      "Off Tank": [{ value: "Monk", label: "Monk" }],
      "Ranged Dps": [
        { value: "Necormancer", label: "Necromancer" },
        { value: "Summoner", label: "Summoner" },
        { value: "Wizard", label: "Wizard" }
      ],
      Support: [
        { value: "Bard", label: "Bard" },
        { value: "Cleric", label: "Cleric" },
        { value: "Druid", label: "Druid" }
      ],
      Tank: [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Warrior", label: "Warrior" }
      ],
      Utility: [
        { value: "Bard", label: "Bard" },
        { value: "Cleric", label: "Cleric" },
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Druid", label: "Druid" },
        { value: "Enchanter", label: "Enchanter" },
        { value: "Monk", label: "Monk" },
        { value: "Necormancer", label: "Necromancer" },
        { value: "Rogue", label: "Rogue" },
        { value: "Summoner", label: "Summoner" },
        { value: "Warrior", label: "Warrior" },
        { value: "Wizard", label: "Wizard" }
      ]
    }
  },
  Dwarf: {
    // Bard, Cleric, Enchanter, Paladin, Rogue, Warrior
    roleOptions: [
      { value: "Crowd Control", label: "Crowd Control" },
      { value: "Healer", label: "Healer" },
      { value: "Melee Dps", label: "Melee Dps" },
      { value: "Support", label: "Support" },
      { value: "Tank", label: "Tank" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      "Crowd Control": [{ value: "Enchanter", label: "Enchanter" }],
      Healer: [{ value: "Cleric", label: "Cleric" }],
      "Melee Dps": [{ value: "Rogue", label: "Rogue" }],
      Support: [
        { value: "Bard", label: "Bard" },
        { value: "Cleric", label: "Cleric" }
      ],
      Tank: [
        { value: "Paladin", label: "Paladin" },
        { value: "Warrior", label: "Warrior" }
      ],
      Utility: [
        { value: "Bard", label: "Bard" },
        { value: "Cleric", label: "Cleric" },
        { value: "Enchanter", label: "Enchanter" },
        { value: "Paladin", label: "Paladin" },
        { value: "Rogue", label: "Rogue" },
        { value: "Warrior", label: "Warrior" }
      ]
    }
  },
  Elf: {
    // Bard, Druid, Enchanter, Ranger, Rogue, Shman, Summoner, Warrior, Wizard
    roleOptions: [
      { value: "Crowd Control", label: "Crowd Control" },
      { value: "Healer", label: "Healer" },
      { value: "Melee Dps", label: "Melee Dps" },
      { value: "Ranged Dps", label: "Ranged Dps" },
      { value: "Support", label: "Support" },
      { value: "Tank", label: "Tank" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      "Crowd Control": [{ value: "Enchanter", label: "Enchanter" }],
      Healer: [
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" }
      ],
      "Melee Dps": [
        { value: "Ranger", label: "Ranger" },
        { value: "Rogue", label: "Rogue" }
      ],
      "Ranged Dps": [
        { value: "Ranger", label: "Ranger" },
        { value: "Summoner", label: "Summoner" },
        { value: "Wizard", label: "Wizard" }
      ],
      Support: [
        { value: "Bard", label: "Bard" },
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" }
      ],
      Tank: [
        { value: "Paladin", label: "Paladin" },
        { value: "Warrior", label: "Warrior" }
      ],
      Utility: [
        { value: "Bard", label: "Bard" },
        { value: "Druid", label: "Druid" },
        { value: "Enchanter", label: "Enchanter" },
        { value: "Ranger", label: "Ranger" },
        { value: "Rogue", label: "Rogue" },
        { value: "Shaman", label: "Shaman" },
        { value: "Summoner", label: "Summoner" },
        { value: "Warrior", label: "Warrior" },
        { value: "Wizard", label: "Wizard" }
      ]
    }
  },
  Halfling: {
    // Bard, Druid, Ranger, Rogue, Warrior
    roleOptions: [
      { value: "Healer", label: "Healer" },
      { value: "Melee Dps", label: "Melee Dps" },
      { value: "Ranged Dps", label: "Ranged Dps" },
      { value: "Tank", label: "Tank" },
      { value: "Support", label: "Support" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      Healer: [{ value: "Druid", label: "Druid" }],
      "Melee Dps": [
        { value: "Ranger", label: "Ranger" },
        { value: "Rogue", label: "Rogue" }
      ],
      "Ranged Dps": [{ value: "Ranger", label: "Ranger" }],
      Support: [
        { value: "Bard", label: "Bard" },
        { value: "Druid", label: "Druid" }
      ],
      Tank: [{ value: "Warrior", label: "Warrior" }],
      Utility: [
        { value: "Bard", label: "Bard" },
        { value: "Druid", label: "Druid" },
        { value: "Ranger", label: "Ranger" },
        { value: "Rogue", label: "Rogue" },
        { value: "Warrior", label: "Warrior" }
      ]
    }
  },
  Human: {
    // ALL
    roleOptions: [
      { value: "Crowd Control", label: "Crowd Control" },
      { value: "Healer", label: "Healer" },
      { value: "Melee Dps", label: "Melee Dps" },
      { value: "Off Tank", label: "Off Tank" },
      { value: "Ranged Dps", label: "Ranged Dps" },
      { value: "Support", label: "Support" },
      { value: "Tank", label: "Tank" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      "Crowd Control": [{ value: "Enchanter", label: "Enchanter" }],
      Healer: [
        { value: "Cleric", label: "Cleric" },
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" }
      ],
      "Melee Dps": [
        { value: "Monk", label: "Monk" },
        { value: "Ranger", label: "Ranger" },
        { value: "Rogue", label: "Rogue" }
      ],
      "Off Tank": [{ value: "Monk", label: "Monk" }],
      "Ranged Dps": [
        { value: "Ranger", label: "Ranger" },
        { value: "Necormancer", label: "Necromancer" },
        { value: "Summoner", label: "Summoner" },
        { value: "Wizard", label: "Wizard" }
      ],
      Support: [
        { value: "Bard", label: "Bard" },
        { value: "Cleric", label: "Cleric" },
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" }
      ],
      Tank: [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Paladin", label: "Paladin" },
        { value: "Warrior", label: "Warrior" }
      ],
      Utility: [
        { value: "Bard", label: "Bard" },
        { value: "Cleric", label: "Cleric" },
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Druid", label: "Druid" },
        { value: "Enchanter", label: "Enchanter" },
        { value: "Monk", label: "Monk" },
        { value: "Necormancer", label: "Necromancer" },
        { value: "Paladin", label: "Paladin" },
        { value: "Ranger", label: "Ranger" },
        { value: "Rogue", label: "Rogue" },
        { value: "Shaman", label: "Shaman" },
        { value: "Summoner", label: "Summoner" },
        { value: "Warrior", label: "Warrior" },
        { value: "Wizard", label: "Wizard" }
      ]
    }
  },
  Gnome: {
    // Enchanter, Necromancer, Rogue, Summoner, Wizard
    roleOptions: [
      { value: "Crowd Control", label: "Crowd Control" },
      { value: "Melee Dps", label: "Melee Dps" },
      { value: "Ranged Dps", label: "Ranged Dps" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      "Crowd Control": [{ value: "Enchanter", label: "Enchanter" }],
      "Melee Dps": [{ value: "Rogue", label: "Rogue" }],
      "Ranged Dps": [
        { value: "Necormancer", label: "Necromancer" },
        { value: "Summoner", label: "Summoner" },
        { value: "Wizard", label: "Wizard" }
      ],
      Utility: [
        { value: "Enchanter", label: "Enchanter" },
        { value: "Necormancer", label: "Necromancer" },
        { value: "Rogue", label: "Rogue" },
        { value: "Summoner", label: "Summoner" },
        { value: "Wizard", label: "Wizard" }
      ]
    }
  },
  Ogre: {
    // Dire Lord, Druid, Shaman, Warrior
    roleOptions: [
      { value: "Healer", label: "Healer" },
      { value: "Support", label: "Support" },
      { value: "Tank", label: "Tank" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      Healer: [
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" }
      ],
      Support: [
        { value: "Bard", label: "Bard" },
        { value: "Cleric", label: "Cleric" },
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" }
      ],
      Tank: [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Warrior", label: "Warrior" }
      ],
      Utility: [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Druid", label: "Druid" },
        { value: "Shaman", label: "Shaman" },
        { value: "Warrior", label: "Warrior" }
      ]
    }
  },
  Skar: {
    // Dire Lord, Monk, Necromancer, Rogue, Shaman, Warrior
    roleOptions: [
      { value: "Healer", label: "Healer" },
      { value: "Melee Dps", label: "Melee Dps" },
      { value: "Off Tank", label: "Off Tank" },
      { value: "Ranged Dps", label: "Ranged Dps" },
      { value: "Support", label: "Support" },
      { value: "Tank", label: "Tank" },
      { value: "Utility", label: "Utility" }
    ],
    classOptions: {
      Healer: [{ value: "Shaman", label: "Shaman" }],
      "Melee Dps": [
        { value: "Monk", label: "Monk" },
        { value: "Rogue", label: "Rogue" }
      ],
      "Off Tank": [{ value: "Monk", label: "Monk" }],
      "Ranged Dps": [{ value: "Necormancer", label: "Necromancer" }],
      Support: [{ value: "Shaman", label: "Shaman" }],
      Tank: [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Warrior", label: "Warrior" }
      ],
      Utility: [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Monk", label: "Monk" },
        { value: "Necormancer", label: "Necromancer" },
        { value: "Rogue", label: "Rogue" },
        { value: "Shaman", label: "Shaman" },
        { value: "Warrior", label: "Warrior" }
      ]
    }
  }
};

export const raceOptions = [
  { value: "Archai", label: "Archai" }, // Bard, Druid, Monk, Shaman, Warrior, Wizard
  { value: "Dark Myr", label: "Dark Myr" }, // Bard, Cleric, Dire Lord, Druid, Enchanter, Monk, Necromancer, Rogue, Summoner, Warrior, Wizard
  { value: "Dwarf", label: "Dwarf" }, // Bard, Cleric, Enchanter, Paladin, Rogue, Warrior
  { value: "Elf", label: "Elf" }, // Bard, Druid, Enchanter, Ranger, Rogue, Shman, SUmmoner, Warrior, Wizard
  { value: "Halfling", label: "Halfling" }, // Bard, Druid, Ranger, Rogue, Warrior
  { value: "Human", label: "Human" }, // ALL
  { value: "Gnome", label: "Gnome" }, // Enchanter, Necromancer, Rogue, Summoner, Wizard
  { value: "Ogre", label: "Ogre" }, // Dire Lord, Druid, Shaman, Warrior
  { value: "Skar", label: "Skar" } // Skar, Mink, Necrimancer, Rogue, Shaman
];

export const roleOptions = [
  { value: "Crowd Control", label: "Crowd Control" },
  { value: "Healer", label: "Healer" },
  { value: "Melee Dps", label: "Melee Dps" },
  { value: "Off Tank", label: "Off Tank" },
  { value: "Ranged Dps", label: "Ranged Dps" },
  { value: "Support", label: "Support" },
  { value: "Tank", label: "Tank" },
  { value: "Utility", label: "Utility" }
];

export const classOptions = {
  "Crowd Control": [{ value: "Enchanter", label: "Enchanter" }],
  "Melee Dps": [
    { value: "Monk", label: "Monk" },
    { value: "Ranger", label: "Ranger" },
    { value: "Rogue", label: "Rogue" }
  ],
  "Off Tank": [{ value: "Monk", label: "Monk" }],
  "Ranged Dps": [
    { value: "Ranger", label: "Ranger" },
    { value: "Necormancer", label: "Necromancer" },
    { value: "Summoner", label: "Summoner" },
    { value: "Wizard", label: "Wizard" }
  ],
  Healer: [
    { value: "Cleric", label: "Cleric" },
    { value: "Druid", label: "Druid" },
    { value: "Shaman", label: "Shaman" }
  ],
  Tank: [
    { value: "Dire Lord", label: "Dire Lord" },
    { value: "Paladin", label: "Paladin" },
    { value: "Warrior", label: "Warrior" }
  ],
  Support: [
    { value: "Bard", label: "Bard" },
    { value: "Cleric", label: "Cleric" },
    { value: "Druid", label: "Druid" },
    { value: "Shaman", label: "Shaman" }
  ],
  Utility: [
    { value: "Bard", label: "Bard" },
    { value: "Cleric", label: "Cleric" },
    { value: "Dire Lord", label: "Dire Lord" },
    { value: "Druid", label: "Druid" },
    { value: "Enchanter", label: "Enchanter" },
    { value: "Monk", label: "Monk" },
    { value: "Necormancer", label: "Necromancer" },
    { value: "Paladin", label: "Paladin" },
    { value: "Ranger", label: "Ranger" },
    { value: "Rogue", label: "Rogue" },
    { value: "Shaman", label: "Shaman" },
    { value: "Summoner", label: "Summoner" },
    { value: "Warrior", label: "Warrior" },
    { value: "Wizard", label: "Wizard" }
  ]
};
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
export const professionOptions = [
  { value: "Alchemist", label: "Alchemist" },
  { value: "Blacksmith", label: "Blacksmith" },
  { value: "Outfitter", label: "Outfitter" },
  { value: "Provisioner", label: "Provisioner" },
  { value: "Scribe", label: "Scribe" },
  { value: "Stonemason", label: "Stonemason" },
  { value: "Woodworker", label: "Woodworker" }
];
export const professionSpecializationOptions = {
  Alchemist: [],
  Blacksmith: [
    { value: "Armorsmith", label: "Armorsmith" },
    { value: "Weaponsmith", label: "Weaponsmith" }
  ],
  Outfitter: [
    { value: "Leatherworker", label: "Leatherworker" },
    { value: "Tailor", label: "Tailor" }
  ],
  Provisioner: [
    { value: "Brewer", label: "Brewer" },
    { value: "Chef", label: "Chef" }
  ],
  Scribe: [
    { value: "Engraver", label: "Engraver" },
    { value: "Researcher", label: "Researcher" }
  ],
  Stonemason: [
    { value: "Jeweller", label: "Jeweller" },
    { value: "Sculptor", label: "Sculptor" }
  ],
  Woodworker: [
    { value: "Bowyer", label: "Bowyer" },
    { value: "Carver", label: "Carver" }
  ]
};

const choiceStyle = {
  margin: "auto 4px",
  display: "inline-block"
};

export const PollChoices = [
  {
    value: "Multiple",
    label: [
      <i className="fas fa-check-square" />,
      <div style={choiceStyle}>Multiple</div>
    ]
  },
  {
    value: "Select",
    label: [
      <i className="far fa-dot-circle" />,
      <div style={choiceStyle}>Select</div>
    ]
  },
  {
    value: "Text",
    label: [
      <i className="fas fa-align-left" />,
      <div style={choiceStyle}>Text</div>
    ]
  },
  {
    value: "Image",
    label: [
      <i className="fas fa-cloud-upload-alt" />,
      <div style={choiceStyle}>Image</div>
    ]
  }
];

export const switchPollTypeIcon = type => {
  switch (type) {
    case "Multiple":
      return <i className="fas fa-check-square" />;
    case "Select":
      return <i className="far fa-dot-circle" />;
    case "Text":
      return <i className="fas fa-align-left" />;
    case "Image":
      return <i className="fas fa-cloud-upload-alt" />;
  }
};

export const Redirection = (history, userToken, noPermission) => {
  if (!userToken) return <Redirect exact to="/login" />;
  else if (noPermission && history.length > 2)
    return <Redirect exact to={history.goBack()} />;
  else if (noPermission) return <Redirect exact to="/" />;
  return false;
};
