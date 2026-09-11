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

// ✅ All admin routes require authentication and admin privileges
router.use(protect);
router.use(isAdmin);

// ✅ Dashboard
router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.get("/transactions", getAdminTransactions);
router.get("/activities", getAdminActivities);
router.get("/agent-usage", getAdminAgentUsage);
router.get("/plan-distribution", getAdminPlanDistribution);

// ✅ User Management
router.put("/users/:id/credits", updateUserCredits);
router.put("/users/:id/plan", updateUserPlan);
router.patch("/users/:id/status", toggleUserStatus);
router.delete("/users/:id", deleteUser);

// ✅ Settings
router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);

export default router;