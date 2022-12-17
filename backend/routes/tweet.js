import express from "express";
import {getTweetOwnerAccess, isAuth} from "../middlewares/auth/auth.js";
import {createTweet,getTweetById,deleteTweet} from "../controllers/tweet.js"
import mentionRoutes from "./mention.js";
const router = express.Router();

router.post("/", isAuth, getTweetById);
router.post("/create", isAuth, createTweet);
router.put("/delete", [isAuth, getTweetOwnerAccess], deleteTweet);

router.use("/mention", mentionRoutes);
export default router;