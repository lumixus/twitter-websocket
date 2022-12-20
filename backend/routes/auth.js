import express from "express";
import { register, login,logout,editProfile,profile,uploadPhoto,forgotPassword,resetPassword,changePassword,deactiveAccount,emailConfirmation,removePicture,follow,unfollow } from "../controllers/auth.js";
import { isAuth,profileOwnerAccess } from "../middlewares/auth/auth.js";
import { isUserExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", isUserExist, login);
router.get("/logout", isAuth, logout);
router.put("/edit", [isAuth, profileOwnerAccess], editProfile);
router.get("/profile", isAuth, profile);
router.post("/upload", isAuth, uploadPhoto);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/passwordchange", isAuth, changePassword);
router.post("/deactive", isAuth, deactiveAccount);
router.get("/emailconfirmation", emailConfirmation);
router.get("/removepicture", isAuth, removePicture);
router.post("/follow", [isAuth,isUserExist], follow);
router.post("/unfollow", [isAuth,isUserExist], unfollow);
export default router;
