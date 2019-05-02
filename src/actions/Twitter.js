import Twitter from "twitter";

const {
  REACT_APP_TWITTER_CONSUMER_KEY,
  REACT_APP_TWITTER_CONSUMER_SECRET,
  REACT_APP_TWITTER_ACCESS_TOKEN_KEY,
  REACT_APP_TWITTER_ACCESS_TOKEN_SECRET
} = process.env;

let client = new Twitter({
  consumer_key: REACT_APP_TWITTER_CONSUMER_KEY,
  consumer_secret: REACT_APP_TWITTER_CONSUMER_SECRET,
  access_token_key: REACT_APP_TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: REACT_APP_TWITTER_ACCESS_TOKEN_SECRET
});

const getFavorites = () => {
  client.get("favorites/list", function(error, tweets, response) {
    if (error) throw error;
    console.log(tweets); // The favorites.
    console.log(response); // Raw response object.
  });
};

const postStatus = () => {
  client
    .post("statuses/update", { status: "I Love Twitter" })
    .then(tweet => {
      console.log(tweet);
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export { getFavorites, postStatus };
