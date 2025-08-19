import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

export async function postTweet(req, res) {
  const { username, tweet } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send("Usuário não encontrado.");

    await Tweet.create({ username, tweet });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getTweets(_, res) {
  try {
    const tweets = await Tweet.find();
    const enriched = await Promise.all(tweets.map(async (t) => {
      const user = await User.findOne({ username: t.username });
      return {
        _id: t._id,
        username: t.username,
        tweet: t.tweet,
        avatar: user?.avatar || ""
      };
    }));

    res.send(enriched);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUserTweets(req, res) {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send("Usuário não encontrado.");

    const tweets = await Tweet.find({ username });
    const enriched = tweets.map(t => ({
      _id: t._id,
      username: t.username,
      tweet: t.tweet,
      avatar: user.avatar
    }));

    res.send(enriched);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteTweet(req, res) {
  const { id } = req.params;

  try {
    await Tweet.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function updateTweet(req, res) {
  const { id } = req.params;
  const { tweet } = req.body;

  try {
    await Tweet.findByIdAndUpdate(id, { tweet });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
