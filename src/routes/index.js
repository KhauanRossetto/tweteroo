import express from "express";
import { signUp } from "../controllers/usersController.js";
import {
  postTweet,
  getTweets,
  getUserTweets,
  deleteTweet,
  updateTweet
} from "../controllers/tweetsController.js";

import validateSchema from "../middlewares/validateSchema.js";
import { userSchema } from "../validators/userSchema.js";
import { tweetSchema } from "../validators/tweetSchema.js";

const router = express.Router();

router.post("/sign-up", validateSchema(userSchema), signUp);
router.post("/tweets", validateSchema(tweetSchema), postTweet);
router.get("/tweets", getTweets);
router.get("/tweets/:username", getUserTweets);
router.delete("/tweets/:id", deleteTweet);
router.put("/tweets/:id", updateTweet);

export default router;
