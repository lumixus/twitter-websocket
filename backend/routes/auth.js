import express from "express";
import { register, login,logout } from "../controllers/auth.js";
import { isAuth } from "../middlewares/auth/auth.js";
import { isUserExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", isUserExist, login);
router.get("/logout", isAuth, logout);

export default router;
