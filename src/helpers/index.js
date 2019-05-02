import React from "react";
import { Redirect } from "react-router-dom";
import { components } from "react-select";
import { Image } from "react-bootstrap";

import Bard from "../images/classIcons/bard.png";
import Cleric from "../images/classIcons/cleric.png";
import DireLord from "../images/classIcons/dire-lord.png";
import Druid from "../images/classIcons/druid.png";
import Enchanter from "../images/classIcons/enchanter.png";
import Monk from "../images/classIcons/monk.png";
import Necromancer from "../images/classIcons/necromancer.png";
import Paladin from "../images/classIcons/paladin.png";
import Ranger from "../images/classIcons/ranger.png";
import Rogue from "../images/classIcons/rogue.png";
import Shaman from "../images/classIcons/shaman.png";
import Summoner from "../images/classIcons/summoner.png";
import Warrior from "../images/classIcons/warrior.png";
import Wizard from "../images/classIcons/wizard.png";
import Random from "../images/classIcons/random.png";
import Tank from "../images/classIcons/tank.png";
import OffTank from "../images/classIcons/off_tank.png";
import Healer from "../images/classIcons/healer.png";
import MeleeDps from "../images/classIcons/melee_dps.png";
import RangedDps from "../images/classIcons/ranged_dps.png";
import Support from "../images/classIcons/support.png";
import Utility from "../images/classIcons/utility.png";
import CrowdControl from "../images/classIcons/crowd_control.png";
import { ReduxStore } from "../index";

const arrayToObject = (arr, keyField) =>
  Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));
const objectToArray = obj => Object.keys(obj).map(key => obj[key]);
const DeepCopy = arrayOrObj => JSON.parse(JSON.stringify(arrayOrObj));
const isOnline = last_login =>
  new Date() - new Date(last_login) <= 1000 * 60 * 5;
const eventLabelColor = tags => {
  const type = tags.split("|")[1];
  if (type == "Dungeon") return "var(--color_emerald)";
  if (type == "Explore") return "var(--color_sunflower)";
  if (type == "Group") return "var(--color_peterRiver)";
  if (type == "Quest") return "var(--color_amethyst)";
  if (type == "Raid") return "var(--color_alizarin)";
  if (type == "VoTShow") return "var(--color_turquoise)";

  return "var(--primaryColor)";
};

const findMaxInt = (arrayOfObjs, prop) =>
  Math.max(...arrayOfObjs.map(e => e[prop]));

const TopKFrequentStrings = (arrayOfObjs, prop, k) => {
  let map = new Map();
  for (let i = 0; i < arrayOfObjs.length; i++) {
    const s = arrayOfObjs[i][prop];
    if (s != undefined && s.length > 0)
      map.has(s) ? map.set(s, map.get(s) + 1) : map.set(s, 1);
  }

  const sortedMap = new Map(
    [...map.entries()].sort().sort((a, b) => b[1] - a[1])
  );
  const newArray = [...sortedMap.keys()].slice(0, k);
  if (newArray.length === 1) return newArray[0];
  else return newArray;
};

const hasCharAfterSpace = string => {
  const charArray = string.split(" ").slice(-2);
  const SecondToLastChar = charArray[0];
  const LastChar = charArray[1];
  if (SecondToLastChar != "" && LastChar == "") return false;

  return true;
};
// arr1.some(e => arr2.includes(e));
const isSubset = (arr1, arr2) => {
  // console.log(arr1, arr2);
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

const isEquivalent = (obj1, obj2) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

const circleColor = status => {
  switch (status) {
    case "Open":
      return "var(--color_emerald)";
    case "Resolved":
      return "var(--color_alizarin)";
    case "Pending":
      return "var(--color_sunflower)";
    default:
      return "var(--primaryColor)";
  }
};

const MainAltCharacter = (User, MainOrAlt) => {
  const DEFAULT = {
    race: null,
    role: null,
    character_class: null,
    profession: null,
    profession_specialization: null
  };

  if (!User) return DEFAULT;
  const { Characters } = User;

  if (Characters === undefined || Characters.length == 0) {
    return DEFAULT;
  }

  return Characters.reduce((a, c) => (a = c[MainOrAlt] ? c : DEFAULT), DEFAULT);
};

const ticketStatusOptions = [
  { value: "Open", label: "Open" },
  { value: "Pending", label: "Pending" },
  { value: "Resolved", label: "Resolved" }
];

const ticketTypeOptions = [
  { value: 3, label: "Harassment" },
  { value: 3, label: "Abuse / Griefing" },
  { value: 3, label: "Exploit" },
  { value: 2, label: "Guild Issue" },
  { value: 2, label: "Website Issue" },
  { value: 2, label: "Discord Issue" },
  { value: 1, label: "General" },
  { value: 1, label: "Feedback" }
];

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getImageBase64 = image => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

const checkNestedProps = (obj, level1) => {
  var args = Array.prototype.slice.call(obj, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
};

const statusLevelInt = User => {
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

const statusLevelString = status => {
  switch (status) {
    case 9:
      return "Admin";
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

const roleClassIcon = roleOrClass => {
  switch (roleOrClass) {
    case "Bard":
      return Bard;
    case "Cleric":
      return Cleric;
    case "Dire Lord":
      return DireLord;
    case "Druid":
      return Druid;
    case "Enchanter":
      return Enchanter;
    case "Monk":
      return Monk;
    case "Necromancer":
      return Necromancer;
    case "Paladin":
      return Paladin;
    case "Ranger":
      return Ranger;
    case "Rogue":
      return Rogue;
    case "Shaman":
      return Shaman;
    case "Summoner":
      return Summoner;
    case "Warrior":
      return Warrior;
    case "Wizard":
      return Wizard;
    case "Any":
      return Random;
    case "Crowd Control":
      return CrowdControl;
    case "Healer":
      return Healer;
    case "Melee Dps":
      return MeleeDps;
    case "Off Tank":
      return OffTank;
    case "Ranged Dps":
      return RangedDps;
    case "Support":
      return Support;
    case "Tank":
      return Tank;
    case "Utility":
      return Utility;
    default:
      return null;
  }
};

const professionIcon = (profession, professionSpecialization) => {
  switch (professionSpecialization || profession) {
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
    // <i className="fas fa-ban" />
  }
};

const renderRoles = User => {
  let Roles = [];
  const {
    is_raid_leader,
    is_banker,
    is_recruiter,
    is_class_lead,
    is_crafter_lead,
    is_host,
    is_lore_master
  } = User;
  const hasRole =
    is_raid_leader ||
    is_banker ||
    is_recruiter ||
    is_class_lead ||
    is_crafter_lead ||
    is_host ||
    is_lore_master;
  if (is_raid_leader) Roles.push("Raid Leader");
  if (is_banker) Roles.push("Banker");
  if (is_recruiter) Roles.push("Recruiter");
  if (is_class_lead) Roles.push("Class Lead");
  if (is_crafter_lead) Roles.push("Crafter Lead");
  if (is_host) Roles.push("VoT Host");
  if (is_lore_master) Roles.push("Lore Master");
  if (!hasRole) Roles.push("No roles");

  return Roles.map(r => <span>{r}</span>);
};

const raceRoleClassOptions = {
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
      "Off Tank": [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Monk", label: "Monk" },
        { value: "Paladin", label: "Paladin" },
        { value: "Warrior", label: "Warrior" }
      ],
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
      "Crowd Control": [
        { value: "Bard", label: "Bard" },
        { value: "Enchanter", label: "Enchanter" }
      ],
      Healer: [
        { value: "Cleric", label: "Cleric" },
        { value: "Druid", label: "Druid" }
      ],
      "Melee Dps": [
        { value: "Monk", label: "Monk" },
        { value: "Rogue", label: "Rogue" }
      ],
      "Off Tank": [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Monk", label: "Monk" },
        { value: "Paladin", label: "Paladin" },
        { value: "Warrior", label: "Warrior" }
      ],
      "Ranged Dps": [
        { value: "Necromancer", label: "Necromancer" },
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
        { value: "Necromancer", label: "Necromancer" },
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
      "Crowd Control": [
        { value: "Bard", label: "Bard" },
        { value: "Enchanter", label: "Enchanter" }
      ],
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
      "Crowd Control": [
        { value: "Bard", label: "Bard" },
        { value: "Enchanter", label: "Enchanter" }
      ],
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
      "Crowd Control": [
        { value: "Bard", label: "Bard" },
        { value: "Enchanter", label: "Enchanter" }
      ],
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
      "Off Tank": [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Monk", label: "Monk" },
        { value: "Paladin", label: "Paladin" },
        { value: "Warrior", label: "Warrior" }
      ],
      "Ranged Dps": [
        { value: "Ranger", label: "Ranger" },
        { value: "Necromancer", label: "Necromancer" },
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
        { value: "Necromancer", label: "Necromancer" },
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
      "Crowd Control": [
        { value: "Bard", label: "Bard" },
        { value: "Enchanter", label: "Enchanter" }
      ],
      "Melee Dps": [{ value: "Rogue", label: "Rogue" }],
      "Ranged Dps": [
        { value: "Necromancer", label: "Necromancer" },
        { value: "Summoner", label: "Summoner" },
        { value: "Wizard", label: "Wizard" }
      ],
      Utility: [
        { value: "Enchanter", label: "Enchanter" },
        { value: "Necromancer", label: "Necromancer" },
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
      "Off Tank": [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Monk", label: "Monk" },
        { value: "Paladin", label: "Paladin" },
        { value: "Warrior", label: "Warrior" }
      ],
      "Ranged Dps": [{ value: "Necromancer", label: "Necromancer" }],
      Support: [{ value: "Shaman", label: "Shaman" }],
      Tank: [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Warrior", label: "Warrior" }
      ],
      Utility: [
        { value: "Dire Lord", label: "Dire Lord" },
        { value: "Monk", label: "Monk" },
        { value: "Necromancer", label: "Necromancer" },
        { value: "Rogue", label: "Rogue" },
        { value: "Shaman", label: "Shaman" },
        { value: "Warrior", label: "Warrior" }
      ]
    }
  }
};

const raceOptions = [
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

const roleOptions = [
  { value: "Any", label: "Any" },
  { value: "Crowd Control", label: "Crowd Control" },
  { value: "Healer", label: "Healer" },
  { value: "Melee Dps", label: "Melee Dps" },
  { value: "Off Tank", label: "Off Tank" },
  { value: "Ranged Dps", label: "Ranged Dps" },
  { value: "Support", label: "Support" },
  { value: "Tank", label: "Tank" },
  { value: "Utility", label: "Utility" }
];

const { Option } = components;
const IconOption = props => {
  const { value, label } = props.data;
  return (
    <Option {...props}>
      <Image src={roleClassIcon(value)} height={20} /> {value}
    </Option>
  );
};

const classOptions = {
  Any: [
    // { value: "Bard", label: "Bard" },
    // { value: "Cleric", label: "Cleric" },
    // { value: "Dire Lord", label: "Dire Lord" },
    // { value: "Druid", label: "Druid" },
    // { value: "Enchanter", label: "Enchanter" },
    // { value: "Monk", label: "Monk" },
    // { value: "Necromancer", label: "Necromancer" },
    // { value: "Paladin", label: "Paladin" },
    // { value: "Ranger", label: "Ranger" },
    // { value: "Rogue", label: "Rogue" },
    // { value: "Shaman", label: "Shaman" },
    // { value: "Summoner", label: "Summoner" },
    // { value: "Warrior", label: "Warrior" },
    // { value: "Wizard", label: "Wizard" }
  ],
  "Crowd Control": [
    { value: "Bard", label: "Bard" },
    { value: "Enchanter", label: "Enchanter" }
  ],
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
  "Off Tank": [
    { value: "Dire Lord", label: "Dire Lord" },
    { value: "Monk", label: "Monk" },
    { value: "Paladin", label: "Paladin" },
    { value: "Warrior", label: "Warrior" }
  ],
  "Ranged Dps": [
    { value: "Ranger", label: "Ranger" },
    { value: "Necromancer", label: "Necromancer" },
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
    { value: "Necromancer", label: "Necromancer" },
    { value: "Paladin", label: "Paladin" },
    { value: "Ranger", label: "Ranger" },
    { value: "Rogue", label: "Rogue" },
    { value: "Shaman", label: "Shaman" },
    { value: "Summoner", label: "Summoner" },
    { value: "Warrior", label: "Warrior" },
    { value: "Wizard", label: "Wizard" }
  ]
};

const professionOptions = [
  { value: "Alchemist", label: "Alchemist" },
  { value: "Blacksmith", label: "Blacksmith" },
  { value: "Outfitter", label: "Outfitter" },
  { value: "Provisioner", label: "Provisioner" },
  { value: "Scribe", label: "Scribe" },
  { value: "Stonemason", label: "Stonemason" },
  { value: "Woodworker", label: "Woodworker" }
];
const professionSpecializationOptions = {
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

const PollChoices = [
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

const switchPollTypeIcon = type => {
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

const Redirection = (history, userToken, noPermission) => {
  if (!userToken) return <Redirect exact to="/login" />;
  else if (noPermission && history.length > 2)
    return <Redirect exact to={history.goBack()} />;
  else if (noPermission) return <Redirect exact to="/" />;
  return false;
};

const RemoveArrayDuplicates = array => [...new Set(array)];

const removeDuplicates = (array, objAttr) => {
  let map = new Map();

  for (let i = 0; i < array.length; i++) {
    try {
      map.set(array[i][objAttr], array[i]);
    } catch (e) {}
  }

  return [...map.values()];
};

const joinStrings = objectArray => objectArray.map(i => i.value).join("|");

const splitString = string =>
  string.split("|").map(
    i =>
      (i = {
        value: i,
        label: i,
        isFixed: i === "Article" || i === "Newsletter"
      })
  );

const GetUserPermissions = user_permissions =>
  ReduxStore.getState().AuthenticationAndAuthorization.AllUserPermissions.filter(
    p => user_permissions.includes(p.id)
  );

export {
  arrayToObject,
  objectToArray,
  DeepCopy,
  isOnline,
  eventLabelColor,
  findMaxInt,
  TopKFrequentStrings,
  hasCharAfterSpace,
  isSubset,
  isEquivalent,
  circleColor,
  MainAltCharacter,
  ticketStatusOptions,
  ticketTypeOptions,
  getRandomInt,
  getImageBase64,
  isEmpty,
  checkNestedProps,
  statusLevelInt,
  statusLevelString,
  roleClassIcon,
  professionIcon,
  renderRoles,
  raceRoleClassOptions,
  professionSpecializationOptions,
  raceOptions,
  roleOptions,
  IconOption,
  classOptions,
  professionOptions,
  PollChoices,
  switchPollTypeIcon,
  Redirection,
  RemoveArrayDuplicates,
  removeDuplicates,
  joinStrings,
  splitString,
  GetUserPermissions
};
