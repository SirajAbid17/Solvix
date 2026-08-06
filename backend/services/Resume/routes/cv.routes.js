// routes/cv.routes.js
import express from "express";
import { uploadRateLimit } from "../middleware/rateLimit.js";
import { createCV, deleteCV, getCVById, getMyCVs, removeProfileImage, updateCV } from "../controller/cvGenerator.controller.js";
import { uploadImage } from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/generate",
  uploadRateLimit,
  uploadImage.single("profileImage"),  createCV
);

router.get("/my-cvs", getMyCVs);
router.get("/:id", getCVById);

router.put(
  "/:id",
  uploadRateLimit,
  uploadImage.single("profileImage"), // Add image upload for update
  updateCV
);

router.delete("/:id", deleteCV);
router.delete("/:id/image", removeProfileImage);

export default router;