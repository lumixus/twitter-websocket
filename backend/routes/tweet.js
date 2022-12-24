import express from "express";
import {getTweetOwnerAccess, isAuth} from "../middlewares/auth/auth.js";
import {createTweet,getTweetById,deleteTweet} from "../controllers/tweet.js"
import mentionRoutes from "./mention.js";
import favoriteRoutes from "./favorite.js";
import reTweetRoutes from "./retweet.js";
import bookmarkRoutes from "./bookmark.js";

const router = express.Router();

router.post("/", isAuth, getTweetById);
router.post("/create", isAuth, createTweet);
router.put("/delete", [isAuth, getTweetOwnerAccess], deleteTweet);
router.use("/mention", mentionRoutes);
router.use("/favorite", favoriteRoutes);
router.use("/retweet", reTweetRoutes);
router.use("/bookmark", bookmarkRoutes)
export default router;