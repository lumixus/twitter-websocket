import express from "express"
import { favoriteMention, favoriteTweet, undoFavoriteMention, undoFavoriteTweet } from "../controllers/favorite.js";
import { isAuth, isMentionExist, isTweetExist } from "../middlewares/auth/auth.js";
const router = express.Router();

router.post("/tweet", [isAuth, isTweetExist], favoriteTweet);
router.post("/mention", [isAuth, isMentionExist], favoriteMention);
router.post("/tweet/undo", [isAuth, isTweetExist], undoFavoriteTweet);
router.post("/mention/undo", [isAuth, isMentionExist], undoFavoriteMention);
export default router;