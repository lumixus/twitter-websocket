import express from "express";
import {register, login} from "../controllers/auth.js";
import { isUserExist } from "../middlewares/error/database/queryHelpers.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", isUserExist ,login);

export default router;