import express from "express";
import { isAuth, isTweetExist, isMentionExist} from "../middlewares/auth/auth.js";
import {getMentionsByTweet, createMention,deleteMention} from "../controllers/mention.js";

const router = express.Router();
router.post("/", isAuth, getMentionsByTweet);
router.post("/create", [isAuth, isTweetExist], createMention);
router.post("/delete", [isAuth, isMentionExist], deleteMention);


export default router;
