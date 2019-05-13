import React from "react";
import { components } from "react-select";
import { Image } from "react-bootstrap";
import { roleClassIcon } from "./index";

const choiceStyle = {
  margin: "auto 4px",
  display: "inline-block"
};

const documentBase = [
  { value: "Official", label: "Official" },
  { value: "Blog", label: "Blog" },
  { value: "FanFiction", label: "FanFiction" },
  { value: "FanMade", label: "FanMade" },
  { value: "Lore", label: "Lore" },
  { value: "Review", label: "Review" },
  { value: "Other", label: "Other" },

  { value: "VR", label: "VR" },
  { value: "Guild", label: "Guild" },
  { value: "Game", label: "Game" },
  { value: "VoTShow", label: "VoTShow" },
  { value: "Community", label: "Community" },
  { value: "VoT", label: "VoT" }
];

const articleSlectOptions = [
  { value: "Article", label: "Article", isFixed: true },
  { value: "Guide", label: "Guide" },
  ...documentBase.slice(1, 7)
];

const newsletterSelectOptions = [
  { value: "Newsletter", label: "Newsletter", isFixed: true },
  ...documentBase.slice(9)
];

const newsSelectOptions = [
  { value: "Article", label: "Article" },
  { value: "Newsletter", label: "Newsletter" },
  ...documentBase
];

const eventTags = [
  { value: "Event", label: "Event", isFixed: true },
  { value: "Dungeon", label: "Dungeon" },
  { value: "Explore", label: "Explore" },
  { value: "Group", label: "Group" },
  { value: "Quest", label: "Quest" },
  { value: "Raid", label: "Raid" },
  { value: "VoTShow", label: "VoTShow" }
];

const GroupAndRaidSubOptions = [
  { value: "Dungeon", label: "Dungeon" },
  { value: "Explore", label: "Explore" },
  { value: "Quest", label: "Quest" },
  { value: "Epic", label: "Epic" },
  { value: "Harvesting", label: "Harvesting" },
  { value: "Crafting", label: "Crafting" },
  { value: "Perception", label: "Perception" },
  { value: "Faction", label: "Faction" }
];

const eventTagOptions = {
  Event: [],
  Group: GroupAndRaidSubOptions,
  Raid: GroupAndRaidSubOptions,
  VoTShow: []
};

const locationTags = [
  { value: "Locations", label: "Locations", isFixed: true },
  { value: "Thronefast", label: "Thronefast" }
];

const galleryImageTags = [
  { value: "Dungeon", label: "Dungeon" },
  { value: "Explore", label: "Explore" },
  { value: "Group", label: "Group" },
  { value: "Quest", label: "Quest" },
  { value: "Raid", label: "Raid" }
];

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

const formOptions = [
  { value: "Form", label: "Form" },
  { value: "Poll", label: "Poll" }
];

const formTypeIcon = type => {
  const defaultType = <i className="fab fa-wpforms" />;
  if (!type) return defaultType;
  const { value } = type;
  switch (value) {
    case "Form":
      return defaultType;
    case "Poll":
      return <i className="fas fa-poll-h" />;
    default:
      return defaultType;
  }
};

const PollQuestionTypeOptions = [
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
  }
];

const FormQuestionTypeOptions = [
  ...PollQuestionTypeOptions,
  ...[
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
  ]
];

const SwitchQuestionOptions = type => {
  const defaultQuestionType = FormQuestionTypeOptions;
  if (!type) return defaultQuestionType;
  const { value } = type;
  switch (value) {
    case "Form":
      return defaultQuestionType;
    case "Poll":
      return PollQuestionTypeOptions;
    default:
      return defaultQuestionType;
  }
};

const { Option } = components;
const IconOption = props => {
  const { value, label } = props.data;
  return (
    <Option {...props}>
      <Image src={roleClassIcon(value)} height={20} /> {value}
    </Option>
  );
};

export {
  documentBase,
  articleSlectOptions,
  newsletterSelectOptions,
  newsSelectOptions,
  eventTags,
  eventTagOptions,
  locationTags,
  galleryImageTags,
  ticketStatusOptions,
  ticketTypeOptions,
  raceRoleClassOptions,
  raceOptions,
  roleOptions,
  classOptions,
  professionOptions,
  professionSpecializationOptions,
  formOptions,
  formTypeIcon,
  PollQuestionTypeOptions,
  FormQuestionTypeOptions,
  SwitchQuestionOptions,
  IconOption
};
