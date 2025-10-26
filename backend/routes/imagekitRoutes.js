import express from "express";
import { uploadImage } from "../controllers/imagekitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/upload", protect, uploadImage);

export default router;
