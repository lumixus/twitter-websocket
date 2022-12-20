import express from "express";
import { isAuth} from "../middlewares/auth/auth.js";
import {getMentionsByTweet, createMention,deleteMention} from "../controllers/mention.js";
import { isMentionExist, isTweetExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();
router.post("/", isAuth, getMentionsByTweet);
router.post("/create", [isAuth, isTweetExist], createMention);
router.put("/delete", [isAuth, isMentionExist], deleteMention);


export default router;
