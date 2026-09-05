import express from "express";
import { uploadImage } from "../middleware/multer.js";
import {
  createCV,
  deleteCV,
  getCVById,
  getMyCVs,
  removeProfileImage,
  updateCV
} from "../controller/cvGenerator.controller.js";
import { uploadRateLimit } from "../../../shared/rateLimit.js";

const router = express.Router();

router.post("/generate", uploadRateLimit, uploadImage.single("profileImage"), createCV);
router.get("/my-cvs", getMyCVs);
router.get("/:id", getCVById);
router.put("/:id", uploadRateLimit, uploadImage.single("profileImage"), updateCV);
router.delete("/:id", deleteCV);
router.delete("/:id/image", removeProfileImage);

export default router;