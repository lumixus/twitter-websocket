import express from "express";
import { bookmarks, editProfile, getMentions, favorites, profile, removePicture, uploadPhoto,follow, unfollow } from "../controllers/user.js";
import { isAuth } from "../middlewares/auth/auth.js";
import { isUserExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();
router.put("/edit", isAuth, editProfile);
router.post("/profile", [isAuth, isUserExist], profile);
router.post("/follow", [isAuth,isUserExist], follow);
router.post("/unfollow", [isAuth,isUserExist], unfollow);
router.post("/upload", isAuth, uploadPhoto);
router.post("/mentions", isAuth, getMentions);
router.get("/removepicture", isAuth, removePicture);
router.get("/bookmarks", isAuth, bookmarks);
router.post("/favorites", isAuth, favorites);

export default router;