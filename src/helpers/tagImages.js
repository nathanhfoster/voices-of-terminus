import ArticleDefault from "../images/Articles/default.png";

import NewsDefault from "../images/News/default.png";
import Community from "../images/News/community.png";
import Game from "../images/News/game.png";
import Guild from "../images/News/guild.png";
import Official from "../images/News/official.png";
import VotShow from "../images/News/show.png";
import VoT from "../images/News/vot.png";

const tagImage = tags =>
  tags.includes("Newsletter") ? newsLetterImage(tags) : articleImage(tags);

const newsLetterImage = tags => {
  if (tags.includes("Official")) return Official;
  if (tags.includes("VR")) return Official;
  if (tags.includes("Guild")) return Guild;
  if (tags.includes("Game")) return Game;
  if (tags.includes("VoTShow")) return VotShow;
  if (tags.includes("Community")) return Community;
  if (tags.includes("VoT")) return VoT;
  //   if (tags.includes("Blog"))
  //   if (tags.includes("FanMade"))
  //   if (tags.includes("Guide"))
  //   if (tags.includes("Lore"))
  //   if (tags.includes("Review"))
  //   if (tags.includes("VotVotShow"))
  //   if (tags.includes("Other"))
  return NewsDefault;
};

const articleImage = tags => {
  return ArticleDefault;
};

export { tagImage };
