const documentBase = [
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
  ...documentBase.slice(0, 6)
];

const newsletterSelectOptions = [
  { value: "Newsletter", label: "Newsletter", isFixed: true },
  { value: "Official", label: "Official" },
  ...documentBase.slice(8)
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

const eventTagOptions = {
  Event: [],
  Dungeon: [],
  Explore: [],
  Group: GroupAndRaidSubOptions,
  Quest: [],
  Raid: GroupAndRaidSubOptions,
  VoTShow: []
};

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

export {
  documentBase,
  articleSlectOptions,
  newsletterSelectOptions,
  newsSelectOptions,
  eventTags,
  eventTagOptions,
  locationTags,
  galleryImageTags
};
