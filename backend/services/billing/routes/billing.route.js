import express from "express";
import {
  createOrder,
  getPaymentStatus,
  getPaymentHistory,
} from "../controllers/billing.controller.js";

const BillingRoute = express.Router();

BillingRoute.post("/create-order", createOrder);
BillingRoute.get("/payment-status/:sessionId", getPaymentStatus);
BillingRoute.get("/history", getPaymentHistory);

export default BillingRoute;