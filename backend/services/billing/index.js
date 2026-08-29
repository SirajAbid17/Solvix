import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DbConnect from "./config/db.js";
import BillingRoute from "./routes/billing.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006;

// Database connection
DbConnect();

// ✅ Middleware - JSON parsing for all routes except webhook
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// ✅ Mount billing routes
app.use('/', BillingRoute);

// ✅ Health check
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        service: "billing",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`💰 Billing Service running on http://localhost:${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
});