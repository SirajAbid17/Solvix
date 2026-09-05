import express from "express";

import {
  Login,
  Logout,
  UpdateUserPayment,
  GetUserCredits,
  DeductCredits, // ✅ ADDED
} from "../controllers/auth.controller.js";

const Router = express.Router();

Router.post("/login", Login);

Router.post("/logout", Logout);

Router.post(
  "/update-plan",
  UpdateUserPayment
);

Router.get(
  "/user-credits/:firebaseId",
  GetUserCredits
);

// ✅ NEW ENDPOINT
Router.post("/deduct-credits", DeductCredits);

export default Router;