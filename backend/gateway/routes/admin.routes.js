import express from "express";
import {
  getAdminStats,
  getAdminUsers,
  getAdminTransactions,
  getAdminActivities,
  getAdminAgentUsage,
  getAdminPlanDistribution,
  updateUserCredits,
  updateUserPlan,
  toggleUserStatus,
  deleteUser,
  getAdminSettings,
  updateAdminSettings,
} from "../controllers/admin.controller.js";
import protect from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();


router.use(protect);
router.use(isAdmin);


router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.get("/transactions", getAdminTransactions);
router.get("/activities", getAdminActivities);
router.get("/agent-usage", getAdminAgentUsage);
router.get("/plan-distribution", getAdminPlanDistribution);


router.put("/user/:id/credits", updateUserCredits);
router.put("/user/:id/plan", updateUserPlan);
router.patch("/user/:id/status", toggleUserStatus);
router.delete("/user/:id", deleteUser);


router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);

export default router;