//All of our routes gonna be here.
import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";
import tweetRoutes from "./tweet.js";
import hashtagRoutes from "./hashtag.js";
import userRoutes from "./user.js";
import express from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { search,feed } from "../controllers/index.js";

const router = express.Router();
router.get("/feed", isAuth, feed);
router.get("/search", isAuth, search);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/tweet", tweetRoutes);
router.use("/hashtag", hashtagRoutes);
router.use("/user",userRoutes);

export default router;