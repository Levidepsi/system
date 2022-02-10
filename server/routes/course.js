import express from "express";
import formidable from "express-formidable";
import { requireSign, isInstructor } from "../middleware/index.js";
import {
	uploadImage,
	removeImage,
	create,
	read,
	uploadVideo
} from "../controllers/course.js";
const router = express.Router();

// image
router.post("/course/upload-image", requireSign, uploadImage);
router.post("/course/remove-image", requireSign, removeImage);
// course
router.post("/course", requireSign, isInstructor, create);
router.get("/course/:slug", read);
router.post("/course/video-upload", requireSign, formidable(), uploadVideo);

export default router;
