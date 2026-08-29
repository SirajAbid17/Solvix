import stripe from "../config/stripe.js";
import { plans } from "../plans/plan.js";
import Payment from "../models/payment.model.js";

export const createOrder = async (req, res) => {
    try {
        console.log("📥 Create Order Request Received");
        console.log("📋 Headers:", req.headers);
        console.log("📦 Body:", req.body);

        const { planType } = req.body;
        const userId = req.headers["x-user-id"];
        
        console.log("👤 User ID:", userId);
        console.log("📋 Plan Type:", planType);
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found in headers"
            });
        }

        const selectedPlan = plans[planType];
        if (!selectedPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        // If free plan - directly add credits
        if (selectedPlan.price === 0) {
            const payment = new Payment({
                userId: userId,
                orderId: `free_${Date.now()}`,
                amount: 0,
                currency: "USD",
                credits: selectedPlan.credits,
                plan: planType,
                status: "Successfully"
            });
            await payment.save();

            return res.status(200).json({
                success: true,
                message: "Free plan activated",
                credits: selectedPlan.credits,
                payment
            });
        }

        // Create Stripe session for paid plans
        console.log("💳 Creating Stripe session for:", selectedPlan);
        
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        product_data: {
                            name: `Solvix_AI ${selectedPlan.name} Plan`,
                            description: `${selectedPlan.credits} credits`
                        },
                        unit_amount: Math.round(selectedPlan.price * 100),
                        currency: "usd"
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId: userId,
                credits: String(selectedPlan.credits),
                plan: planType
            },
            success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/pricing`
        });

        console.log("✅ Stripe session created:", session.id);

        // Save payment record
        const payment = new Payment({
            userId: userId,
            orderId: session.id,
            amount: selectedPlan.price,
            currency: "USD",
            credits: selectedPlan.credits,
            plan: planType,
            status: "Created"
        });
        await payment.save();

        return res.status(200).json({
            success: true,
            sessionUrl: session.url,
            sessionId: session.id,
            payment
        });

    } catch (error) {
        console.error("❌ Create Order Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create order"
        });
    }
};

// Webhook handler
export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            const payment = await Payment.findOneAndUpdate(
                { orderId: session.id },
                { 
                    status: "Paid",
                    paymentId: session.payment_intent
                },
                { new: true }
            );

            if (payment) {
                console.log(`✅ Payment successful for user ${session.metadata.userId}`);
                console.log(`✅ Credits added: ${session.metadata.credits}`);
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found"
            });
        }

        const payment = await Payment.findOne({ 
            orderId: sessionId,
            userId: userId 
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error("Get Payment Status Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's payment history
export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found"
            });
        }

        const payments = await Payment.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            payments
        });

    } catch (error) {
        console.error("Get Payment History Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};