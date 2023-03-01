import express from "express";
import { bookmarks, editProfile, favorites, profile, removePicture, uploadPhoto } from "../controllers/user.js";
import { isAuth } from "../middlewares/auth/auth.js";
import { isUserExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();
router.put("/edit", isAuth, editProfile);
router.post("/profile", [isAuth, isUserExist], profile);
router.post("/upload", isAuth, uploadPhoto);
router.get("/removepicture", isAuth, removePicture);
router.get("/bookmarks", isAuth, bookmarks);
router.get("/favorites", isAuth, favorites);

export default router;