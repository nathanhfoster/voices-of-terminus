import ArticleDefault from "../images/Articles/default.png";
import Blog from '../images/Articles/blog.png'
import FanFiction from '../images/Articles/fanfiction.png'
import FanMade from '../images/Articles/fanmade.png'
import Guide from '../images/Articles/guide.png'
import Lore from '../images/Articles/lore.png'
import Review from '../images/Articles/review.png'

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

  return NewsDefault;
};

const articleImage = tags => {
  if (tags.includes("Blog")) return Blog;
  if (tags.includes("FanFiction")) return FanFiction;
  if (tags.includes("FanMade")) return FanMade;
  if (tags.includes("Guide")) return Guide;
  if (tags.includes("Lore")) return Lore;
  if (tags.includes("Review")) return Review;

  return ArticleDefault;
};

export { tagImage };