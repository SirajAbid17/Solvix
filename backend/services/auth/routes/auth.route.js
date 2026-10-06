import express from "express";

import {
  Login,
  Logout,
  UpdateUserPayment,
  GetUserCredits,
  DeductCredits,
  getAdminUsersStats,
  getAdminUsersList,
  getUserById,
  updateUserCreditsAdmin,
  updateUserPlanAdmin,
  toggleUserStatusAdmin,
  deleteUserAdmin,
  getPlanDistribution,
} from "../controllers/auth.controller.js";
import { authRateLimit } from "../../../shared/authRateLimit.js";



const Router = express.Router();

// Public routes
Router.post(
  "/login",
  authRateLimit,
  Login
);

Router.post("/logout", Logout);

// Protected routes
Router.post("/update-plan", UpdateUserPayment);

Router.get(
  "/user-credits/:firebaseId",
  GetUserCredits
);

Router.post(
  "/deduct-credits",
  DeductCredits
);

// Admin Routes
Router.get("/admin/users/stats", getAdminUsersStats);
Router.get("/admin/users", getAdminUsersList);
Router.get("/admin/user/:id", getUserById);

Router.put(
  "/admin/user/:id/credits",
  updateUserCreditsAdmin
);

Router.put(
  "/admin/user/:id/plan",
  updateUserPlanAdmin
);

Router.patch(
  "/admin/user/:id/status",
  toggleUserStatusAdmin
);

Router.delete(
  "/admin/user/:id",
  deleteUserAdmin
);

Router.get(
  "/admin/plan-distribution",
  getPlanDistribution
);

export default Router;