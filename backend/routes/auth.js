import express from "express";
import { firstOnBoarding, verify,finalOnBoarding,login,logout,forgotPassword,resetPassword,changePassword,deactiveAccount,emailConfirmation, getUserWithCookie } from "../controllers/auth.js";
import { isAuth } from "../middlewares/auth/auth.js";

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
router.get("/getUser", [isAuth], getUserWithCookie);

export default router;