//All of our routes gonna be here.
import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";
import tweetRoutes from "./tweet.js";
import express from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { search } from "../controllers/index.js";

const router = express.Router();
router.get("/search", isAuth, search);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/tweet", tweetRoutes)

export default router;