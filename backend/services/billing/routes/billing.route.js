import express from "express";
import { 
    createOrder, 
    handleWebhook, 
    getPaymentStatus,
    getPaymentHistory
} from "../controllers/billing.controller.js";

const BillingRoute = express.Router();

// ✅ Webhook endpoint (no auth)
BillingRoute.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

// ✅ API endpoints (will be accessed as /create-order from gateway)
BillingRoute.post('/create-order', createOrder);
BillingRoute.get('/payment-status/:sessionId', getPaymentStatus);
BillingRoute.get('/history', getPaymentHistory);

// ✅ Test endpoint
BillingRoute.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: "Billing service is working!",
        timestamp: new Date().toISOString()
    });
});

export default BillingRoute;