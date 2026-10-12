import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DbConnect from "./config/db.js";
import BillingRoute from "./routes/billing.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006;

DbConnect();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/", BillingRoute);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "billing",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Billing Service running on http://localhost:${PORT}`);
});