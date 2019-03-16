import Community from "../images/News/community.png";
import Default from "../images/News/defualt.png";
import Game from "../images/News/game.png";
import Guild from "../images/News/guild.png";
import Official from "../images/News/official.png";
import Show from "../images/News/show.png";

export const tagImage = tags => {
  const T = tags.split("|")[1];
  if (T == "VR") return Official;
  if (T == "Guild") return Guild;
  if (T == "Game") return Game;
  if (T == "Show") return Show;
  if (T == "Community") return Community;
  if (T == "VoT") return Default;
  //   if (T == "Blog")
  //   if (T == "FanMade")
  //   if (T == "Guide")
  //   if (T == "Lore")
  //   if (T == "Review")
  //   if (T == "VotShow")
  //   if (T == "Other")
  return Default;
};
