import express from "express";
import { register, login,logout,editProfile } from "../controllers/auth.js";
import { isAuth,profileOwnerAccess } from "../middlewares/auth/auth.js";
import { isUserExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", isUserExist, login);
router.get("/logout", isAuth, logout);
router.put("/edit", [isAuth, profileOwnerAccess], editProfile);

export default router;
