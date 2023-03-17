import express from "express";
import { isAuth} from "../middlewares/auth/auth.js";
import {getMentionsByTweet} from "../controllers/mention.js";
import { isTweetExist } from "../middlewares/database/queryHelpers.js";
import { createTweet } from "../controllers/tweet.js";

const router = express.Router();
router.post("/", isAuth, getMentionsByTweet);
router.post("/create", [isAuth, isTweetExist], createTweet);


export default router;
