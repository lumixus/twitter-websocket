import express from "express";
import { addBookmark,undoBookmark } from "../controllers/bookmark.js";
import { isAuth } from "../middlewares/auth/auth.js";
import { isTweetExist} from "../middlewares/database/queryHelpers.js";

const router = express.Router();

router.post("/", [isAuth, isTweetExist], addBookmark);
router.post("/undo", [isAuth, isTweetExist], undoBookmark);

export default router;