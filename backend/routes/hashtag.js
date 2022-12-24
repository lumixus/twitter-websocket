import express from "express";
import { trends } from "../controllers/hashtag.js";
import { isAuth } from "../middlewares/auth/auth.js";

const router = express.Router();

router.get("/trends", isAuth, trends);

export default router;