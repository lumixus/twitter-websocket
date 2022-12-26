import express from "express";
import { blockUser,unblockUser,getAllUsers } from "../controllers/admin.js";
import { isAuth ,adminAccess} from "../middlewares/auth/auth.js";
const router = express.Router();
router.use([isAuth, adminAccess]);
router.post("/block", blockUser);
router.post("/unblock", unblockUser);
router.get("/users", getAllUsers);


export default router;