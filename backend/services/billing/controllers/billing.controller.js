import stripe from "../config/stripe.js";
import { plans } from "../plans/plan.js";
import Payment from "../models/payment.model.js";
import axios from "axios";

/*
====================================================
UPDATE USER PLAN
====================================================
*/

const updateUserPlan = async (userId, plan, credits) => {
  try {
    const authServiceUrl = process.env.AUTH_SERVICES_URL || "http://localhost:5001";
    const url = `${authServiceUrl}/update-plan`;

    console.log("");
    console.log("🔄 Updating Auth Service");
    console.log("URL:", url);
    console.log("User ID:", userId);
    console.log("Plan:", plan);
    console.log("Credits:", credits);

    const response = await axios.post(
      url,
      {
        userId: String(userId),
        plan,
        credits: Number(credits),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("✅ Auth Service Updated");
    return response.data;
  } catch (error) {
    console.error("❌ Auth Update Failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    }
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

/*
====================================================
CREATE ORDER
====================================================
*/

export const createOrder = async (req, res) => {
  try {
    const { planType } = req.body;
    const userId = req.headers["x-user-id"];

    console.log("");
    console.log("========================================");
    console.log("📥 CREATE ORDER");
    console.log("========================================");
    console.log("👤 User ID:", userId);
    console.log("📦 Plan:", planType);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in headers",
      });
    }

    const selectedPlan = plans[planType];

    if (!selectedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // FREE PLAN
    if (Number(selectedPlan.price) === 0) {
      const result = await updateUserPlan(userId, planType, selectedPlan.credits);

      const payment = await Payment.create({
        userId: String(userId),
        orderId: `free_${Date.now()}_${userId}`,
        amount: 0,
        currency: "USD",
        credits: selectedPlan.credits,
        plan: planType,
        status: "Paid",
        creditsAdded: true,
      });

      return res.status(200).json({
        success: true,
        message: "Free plan activated",
        user: result.data?.user,
        payment,
      });
    }

    // STRIPE CHECKOUT
    console.log("💳 Creating Stripe Checkout...");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            product_data: {
              name: `Solvix AI ${selectedPlan.name} Plan`,
              description: `${selectedPlan.credits} AI credits`,
            },
            unit_amount: Math.round(selectedPlan.price * 100),
            currency: "usd",
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(userId),
        plan: String(planType),
        credits: String(selectedPlan.credits),
      },
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/pricing`,
    });

    const payment = await Payment.create({
      userId: String(userId),
      orderId: session.id,
      amount: selectedPlan.price,
      currency: "USD",
      credits: selectedPlan.credits,
      plan: planType,
      status: "Created",
      creditsAdded: false,
    });

    console.log("");
    console.log("========================================");
    console.log("✅ STRIPE CHECKOUT CREATED");
    console.log("Session:", session.id);
    console.log("User:", userId);
    console.log("Plan:", planType);
    console.log("Credits:", selectedPlan.credits);
    console.log("Amount:", selectedPlan.price);
    console.log("========================================");

    return res.status(200).json({
      success: true,
      sessionUrl: session.url,
      sessionId: session.id,
      payment,
    });
  } catch (error) {
    console.error("❌ Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

/*
====================================================
VERIFY STRIPE PAYMENT
====================================================
*/

export const getPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.headers["x-user-id"];

    console.log("");
    console.log("========================================");
    console.log("🔍 VERIFY PAYMENT");
    console.log("========================================");
    console.log("Session ID:", sessionId);
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const payment = await Payment.findOne({
      orderId: sessionId,
      userId: String(userId),
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (payment.creditsAdded) {
      console.log("⚠️ Credits already added");
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        payment,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Stripe Payment Status:", session.payment_status);

    if (session.payment_status !== "paid") {
      payment.status = "Failed";
      await payment.save();
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed",
        paymentStatus: session.payment_status,
      });
    }

    const metadata = session.metadata || {};
    const stripeUserId = metadata.userId;
    const stripePlan = metadata.plan;
    const stripeCredits = Number(metadata.credits);

    if (!stripeUserId || !stripePlan || !stripeCredits) {
      return res.status(400).json({
        success: false,
        message: "Invalid Stripe payment metadata",
      });
    }

    if (String(stripeUserId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Payment does not belong to this user",
      });
    }

    if (stripePlan !== payment.plan) {
      return res.status(400).json({
        success: false,
        message: "Payment plan mismatch",
      });
    }

    if (stripeCredits !== payment.credits) {
      return res.status(400).json({
        success: false,
        message: "Payment credits mismatch",
      });
    }

    console.log("💳 Adding credits...");
    const result = await updateUserPlan(userId, stripePlan, stripeCredits);

    payment.status = "Paid";
    payment.paymentId = session.payment_intent || undefined;
    payment.creditsAdded = true;
    await payment.save();

    console.log("");
    console.log("========================================");
    console.log("🎉 PAYMENT COMPLETED");
    console.log("User:", userId);
    console.log("Plan:", stripePlan);
    console.log("Credits Added:", stripeCredits);
    console.log("========================================");

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added",
      payment,
      user: result.data?.user || null,
    });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};

/*
====================================================
GET PAYMENT HISTORY
====================================================
*/

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const payments = await Payment.find({
      userId: String(userId),
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("❌ Payment History Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// ADMIN: GET BILLING STATS
// ============================================================

export const getAdminBillingStats = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "Paid" });
    
    let totalRevenue = 0;
    let totalTransactions = payments.length;
    let totalCreditsSold = 0;

    for (const payment of payments) {
      totalRevenue += payment.amount || 0;
      totalCreditsSold += payment.credits || 0;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalTransactions,
        totalCreditsSold,
      },
    });
  } catch (error) {
    console.error("Get Admin Billing Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// ADMIN: GET TRANSACTIONS
// ============================================================

export const getAdminTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Payment.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments({});

    const formattedTransactions = transactions.map((t) => ({
      id: t._id,
      user: t.userId || "Unknown",
      plan: t.plan || "Unknown",
      amount: t.amount || 0,
      credits: t.credits || 0,
      status: t.status || "Pending",
      createdAt: t.createdAt,
    }));

    return res.status(200).json({
      success: true,
      transactions: formattedTransactions,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Get Admin Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};