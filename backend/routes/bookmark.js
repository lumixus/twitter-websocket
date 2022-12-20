import express from "express";
import { addBookmark,undoBookmark,addBookmarkMention,undoBookmarkMention } from "../controllers/bookmark.js";
import { isAuth } from "../middlewares/auth/auth.js";
import { isTweetExist, isMentionExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();

router.post("/", [isAuth, isTweetExist], addBookmark);
router.post("/mention", [isAuth, isMentionExist], addBookmarkMention);
router.post("/undo", [isAuth, isTweetExist], undoBookmark);
router.post("/undo/mention", [isAuth, isMentionExist], undoBookmarkMention);

export default router;