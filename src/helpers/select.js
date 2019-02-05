const documentBase = [
  { value: "Official", label: "Official" },
  { value: "Blog", label: "Blog" },
  { value: "FanMade", label: "FanMade" },
  { value: "Guide", label: "Guide" },
  { value: "Lore", label: "Lore" },
  { value: "Review", label: "Review" },
  { value: "VotShow", label: "VotShow" },
  { value: "Other", label: "Other" }
];

export const newsSelectOptions = [
  { value: "Article", label: "Article" },
  { value: "Newsletter", label: "Newsletter" },
  ...documentBase
];

export const articleSlectOptions = [
  { value: "Article", label: "Article", isFixed: true },
  ...documentBase
];

export const newsletterSelectOptions = [
  { value: "Newsletter", label: "Newsletter", isFixed: true },
  ...documentBase
];

export const eventTags = [
  { value: "Explore", label: "Explore" },
  { value: "Group", label: "Group" },
  { value: "Raid", label: "Raid" },
  { value: "Quest", label: "Quest" }
];

export const galleryImageTags = [
  { value: "Explore", label: "Explore" },
  { value: "Group", label: "Group" },
  { value: "Raid", label: "Raid" },
  { value: "Quest", label: "Quest" }
];
