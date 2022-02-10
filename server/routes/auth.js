import express from "express";
import {
	register,
	login,
	logout,
	currentUser,
	forgotPassword,
	resetPassword
} from "../controllers/auth.js";
import { requireSign } from "../middleware/index.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", logout);
router.get("/current-user", requireSign, currentUser);
export default router;
