import express from "express";
import { firstOnBoarding, verify,finalOnBoarding,login,logout,editProfile,profile,uploadPhoto,forgotPassword,resetPassword,changePassword,deactiveAccount,emailConfirmation,removePicture,follow,unfollow,bookmarks,favorites } from "../controllers/auth.js";
import { isAuth } from "../middlewares/auth/auth.js";
import { isUserExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();

router.post("/firstonboarding", firstOnBoarding);
router.post("/verify", verify);
router.post("/finalonboarding" ,finalOnBoarding);
router.post("/login", isUserExist, login);
router.get("/logout", isAuth, logout);
router.put("/edit", isAuth, editProfile);
router.post("/profile", [isAuth, isUserExist], profile);
router.post("/upload", isAuth, uploadPhoto);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/passwordchange", isAuth, changePassword);
router.post("/deactive", isAuth, deactiveAccount);
router.get("/emailconfirmation", emailConfirmation);
router.get("/removepicture", isAuth, removePicture);
router.post("/follow", [isAuth,isUserExist], follow);
router.post("/unfollow", [isAuth,isUserExist], unfollow);
router.get("/bookmarks", isAuth, bookmarks);
router.get("/favorites", isAuth, favorites);
export default router;
