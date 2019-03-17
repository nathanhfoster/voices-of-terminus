import ArticleDefault from "../images/Articles/default.png";

import Community from "../images/News/community.png";
import NewsDefault from "../images/News/default.png";
import Game from "../images/News/game.png";
import Guild from "../images/News/guild.png";
import Official from "../images/News/official.png";
import Show from "../images/News/show.png";
import VoT from "../images/News/vot.png";

export const tagImage = tags => {
  const Default = tags.includes("Newsletter") ? NewsDefault : ArticleDefault;
  if (tags.includes("VR")) return Official;
  if (tags.includes("Guild")) return Guild;
  if (tags.includes("Game")) return Game;
  if (tags.includes("Show")) return Show;
  if (tags.includes("Community")) return Community;
  if (tags.includes("VoT")) return VoT;
  //   if (tags.includes("Blog"))
  //   if (tags.includes("FanMade"))
  //   if (tags.includes("Guide"))
  //   if (tags.includes("Lore"))
  //   if (tags.includes("Review"))
  //   if (tags.includes("VotShow"))
  //   if (tags.includes("Other"))
  return Default;
};
