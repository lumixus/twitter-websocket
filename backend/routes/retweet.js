import express from "express";
import {isAuth, isMentionExist, isTweetExist} from "../middlewares/auth/auth.js";
import {reTweet, reTweetMention,undoReTweet,undoReTweetMention} from "../controllers/retweet.js";

const router = express.Router();

router.post("/", [isAuth, isTweetExist], reTweet);
router.post("/mention", [isAuth, isMentionExist], reTweetMention);
router.post("/undo", [isAuth,isTweetExist], undoReTweet);
router.post("/undo/mention", [isAuth, isMentionExist], undoReTweetMention);
export default router;