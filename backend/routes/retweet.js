import express from "express";
import {isAuth} from "../middlewares/auth/auth.js";
import {reTweet,undoReTweet} from "../controllers/retweet.js";
import { isTweetExist, isMentionExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();

router.post("/", [isAuth, isTweetExist], reTweet);
router.post("/undo", [isAuth,isTweetExist], undoReTweet);
export default router;