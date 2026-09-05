import express from "express";
import {
  uploadPortfolio,
  analyzePortfolioController,
  getPortfolioBySlug,
  getAllUserPortfolios,
  deletePortfolio,
} from "../controllers/portfolio.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { portfolioUser } from "../middlewares/user.middleware.js";

const router = express.Router();

router.get("/:slug", getPortfolioBySlug);

router.post(
  "/upload",
  portfolioUser,
  upload.single("pdf"),
  uploadPortfolio
);

router.post(
  "/:id/analyze",
  portfolioUser,
  analyzePortfolioController
);

router.get(
  "/user/all",
  portfolioUser,
  getAllUserPortfolios
);

router.delete(
  "/:id",
  portfolioUser,
  deletePortfolio
);

export default router;