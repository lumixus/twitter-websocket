import express from "express";
import { blockUser,unblockUser } from "../controllers/admin.js";
const router = express.Router();
import { isAuth ,adminAccess} from "../middlewares/auth/auth.js";

router.post("/block", [isAuth, adminAccess], blockUser);
router.post("/unblock", [isAuth, adminAccess], unblockUser);


export default router;