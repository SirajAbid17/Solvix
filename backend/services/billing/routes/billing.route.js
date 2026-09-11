import express from "express";
import {
  createOrder,
  getPaymentStatus,
  getPaymentHistory,
  getAdminBillingStats,
  getAdminTransactions,
} from "../controllers/billing.controller.js";

const BillingRoute = express.Router();

BillingRoute.post("/create-order", createOrder);
BillingRoute.get("/payment-status/:sessionId", getPaymentStatus);
BillingRoute.get("/history", getPaymentHistory);
BillingRoute.get("/admin/stats", getAdminBillingStats);
BillingRoute.get("/admin/transactions", getAdminTransactions);

export default BillingRoute;