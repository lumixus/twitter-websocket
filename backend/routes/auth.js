import express from "express";
import { firstOnBoarding, verify,finalOnBoarding,login,logout,forgotPassword,resetPassword,changePassword,deactiveAccount,emailConfirmation,follow,unfollow } from "../controllers/auth.js";
import { isAuth } from "../middlewares/auth/auth.js";
import { isUserExist } from "../middlewares/database/queryHelpers.js";

const router = express.Router();

router.post("/firstonboarding", firstOnBoarding);
router.post("/verify", verify);
router.post("/finalonboarding" ,finalOnBoarding);
router.post("/login", login);
router.get("/logout", isAuth, logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/passwordchange", isAuth, changePassword);
router.post("/deactive", isAuth, deactiveAccount);
router.get("/emailconfirmation", emailConfirmation);
router.post("/follow", [isAuth,isUserExist], follow);
router.post("/unfollow", [isAuth,isUserExist], unfollow);
export default router;
