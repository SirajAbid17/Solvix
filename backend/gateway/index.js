import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import protect from "./middleware/auth.middleware.js"
import { CurrentUser } from "./controllers/user.controller.js"
import { ProxyWithHeader } from "./utlis/proxyWithHeader.js"
import morgan from "morgan"
import axios from "axios"
import redis from "../shared/redis/redis.js"
import { trackActivity, getUserActivity } from "../shared/middlewares/activity.middleware.js"

dotenv.config()

const PORT = process.env.PORT
const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(cookieParser())
app.use(morgan("dev"))

// ============================================================
// ✅ CREDITS MIDDLEWARE - SIRF PAID SERVICES KE LIYE
// ============================================================

const checkCredits = async (req, res, next) => {
  try {
    // ✅ AGAR PEHLE SE DEDUCT HO CHUKA HAI TO SKIP KARO
    if (req.creditsAlreadyDeducted) {
      console.log("⏭️ Credits already deducted, skipping...")
      return next()
    }

    const user = req.user

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      })
    }

    const currentCredits = Number(user.credits || 0)

    if (currentCredits < 2) {
      return res.status(402).json({
        success: false,
        message: "Insufficient credits. Please purchase more credits.",
        credits: currentCredits,
        required: 2
      })
    }

    const newCredits = currentCredits - 2

    // ✅ UPDATE AUTH SERVICE
    try {
      await axios.post(
        `${process.env.Auth_Services}/deduct-credits`,
        {
          userId: user.userId || user._id,
          credits: newCredits,
          deducted: 2,
          service: req.path.split('/')[1] || 'unknown'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      )
    } catch (updateError) {
      console.error("❌ Credit update failed:", updateError.message)
      return res.status(500).json({
        success: false,
        message: "Failed to process credits. Please try again."
      })
    }

    // ✅ UPDATE REDIS SESSION
    try {
      const sessionKey = `session-${req.cookies?.sessionid}`
      const sessionData = await redis.get(sessionKey)
      
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        parsed.credits = newCredits
        await redis.set(sessionKey, JSON.stringify(parsed), "EX", 7 * 24 * 60 * 60)
      }
    } catch (redisError) {
      console.error("❌ Redis update failed:", redisError.message)
    }

    // ✅ FLAG SET KARO KE CREDITS DEDUCT HO CHUKE HAIN
    req.creditsAlreadyDeducted = true
    req.remainingCredits = newCredits
    req.creditsDeducted = 2

    console.log(`✅ Credits deducted: 2 | Remaining: ${newCredits} | User: ${user.userId || user._id}`)

    next()

  } catch (error) {
    console.error("❌ Credits middleware error:", error)
    return res.status(500).json({
      success: false,
      message: "Credit processing error. Please try again."
    })
  }
}

// ============================================================
// ✅ SKIP CREDITS - FREE ROUTES KE LIYE
// ============================================================

const skipCredits = (req, res, next) => {
  console.log(`⏭️ SKIPPING credits for FREE route: ${req.path}`)
  next()
}

// ============================================================
// ✅ FREE ROUTES - No credit deduction
// ============================================================

// AUTH - FREE
app.use('/auth', proxy(process.env.Auth_Services))

// ME - FREE
app.get('/me', CurrentUser)

// ✅ GET USER ACTIVITY - FREE
app.get('/activity', protect, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const activity = await getUserActivity(userId);
    
    if (!activity) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch activity data"
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CHAT - FREE with tracking
app.use('/chat', protect, trackActivity, skipCredits, ProxyWithHeader(process.env.Chat_Services))

// AGENT - FREE with tracking
app.use(
  "/agent",
  protect,
  trackActivity,
  skipCredits,
  proxy(process.env.Agent_Services, {
    proxyReqPathResolver: (req) => {
      return `/agent${req.url}`;
    },
  })
)

// BILLING - FREE with tracking
app.use(
  "/billing",
  protect,
  trackActivity,
  skipCredits,
  proxy(process.env.BILLING_SERVICES, {
    proxyReqPathResolver: (req) => {
      const path = req.originalUrl.replace(/^\/billing/, "");
      console.log("\n");
      console.log("====================================");
      console.log("💰 BILLING PROXY (FREE)");
      console.log("====================================");
      console.log("Original URL:", req.originalUrl);
      console.log("Forward URL:", path || "/");
      return path || "/";
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("👤 Billing srcReq.user:", srcReq.user);

      const userId = srcReq.user?._id || srcReq.user?.userId || srcReq.user?.user?._id;

      console.log("🔑 Extracted User ID:", userId);

      if (!userId) {
        console.error("❌ User ID not found in Gateway");
        throw new Error("User ID not found");
      }

      proxyReqOpts.headers["x-user-id"] = String(userId);
      proxyReqOpts.headers["x-user-email"] = srcReq.user?.email || srcReq.user?.user?.email || "";
      proxyReqOpts.headers["x-user-name"] = srcReq.user?.name || srcReq.user?.user?.name || "";

      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization = srcReq.headers.authorization;
      }

      if (srcReq.headers.cookie) {
        proxyReqOpts.headers.cookie = srcReq.headers.cookie;
      }

      if (srcReq.headers["content-type"]) {
        proxyReqOpts.headers["content-type"] = srcReq.headers["content-type"];
      }

      console.log("📤 Sending x-user-id to Billing:", proxyReqOpts.headers["x-user-id"]);
      console.log("====================================");

      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
      console.error("❌ Billing Proxy Error:", err);
      res.status(500).json({
        success: false,
        message: err.message || "Billing service unavailable"
      });
    }
  })
)

// ============================================================
// ✅ RESUME - PAID (SIRF UPLOAD PAR CREDITS DEDUCT HO)
// ============================================================

// ✅ Resume Upload - PAID (2 credits) - ORDER FIXED: checkCredits FIRST then trackActivity
app.post(
  "/resume/upload",
  protect,
  checkCredits,      // ✅ PEHLE CREDITS DEDUCT KARO
  trackActivity,     // ✅ PHIR ACTIVITY TRACK KARO
  proxy(process.env.Resume_Services, {
    proxyReqPathResolver: (req) => {
      return `/resume/upload`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("Resume Upload User:", srcReq.user);

      if (!srcReq.user) {
        throw new Error("User not found");
      }

      const userId = srcReq.user._id || srcReq.user.userId || srcReq.user?.user?._id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      proxyReqOpts.headers["x-user-id"] = String(userId);
      proxyReqOpts.headers["x-user-email"] = srcReq.user.email || srcReq.user?.user?.email || "";
      proxyReqOpts.headers["x-user-name"] = srcReq.user.name || srcReq.user?.user?.name || "";

      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization = srcReq.headers.authorization;
      }

      if (srcReq.headers.cookie) {
        proxyReqOpts.headers.cookie = srcReq.headers.cookie;
      }

      if (srcReq.headers["content-type"]) {
        proxyReqOpts.headers["content-type"] = srcReq.headers["content-type"];
      }

      return proxyReqOpts;
    },
    parseReqBody: false,
    proxyErrorHandler: (err, res) => {
      console.error("Resume Upload Proxy Error:", err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    },
  })
)

// Resume GET routes - FREE with tracking
app.use(
  "/resume",
  protect,
  trackActivity,
  skipCredits,
  proxy(process.env.Resume_Services, {
    proxyReqPathResolver: (req) => {
      return `/resume${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("Resume GET User:", srcReq.user);

      if (!srcReq.user) {
        throw new Error("User not found");
      }

      const userId = srcReq.user._id || srcReq.user.userId || srcReq.user?.user?._id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      proxyReqOpts.headers["x-user-id"] = String(userId);
      proxyReqOpts.headers["x-user-email"] = srcReq.user.email || srcReq.user?.user?.email || "";
      proxyReqOpts.headers["x-user-name"] = srcReq.user.name || srcReq.user?.user?.name || "";

      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization = srcReq.headers.authorization;
      }

      if (srcReq.headers.cookie) {
        proxyReqOpts.headers.cookie = srcReq.headers.cookie;
      }

      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
      console.error("Resume GET Proxy Error:", err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    },
    parseReqBody: false,
  })
)

// ============================================================
// ✅ PAID ROUTES - 2 Credits deducted (SIRF YEH 2 ROUTES)
// ============================================================

// ✅ CV - PAID - ORDER FIXED: checkCredits FIRST then trackActivity
app.use(
  "/cv",
  protect,
  checkCredits,      // ✅ PEHLE CREDITS DEDUCT KARO
  trackActivity,     // ✅ PHIR ACTIVITY TRACK KARO
  proxy(process.env.CV_Services || process.env.Resume_Services, {
    proxyReqPathResolver: (req) => {
      return `/cv${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("CV User:", srcReq.user);

      if (!srcReq.user) {
        throw new Error("User not found");
      }

      const userId = srcReq.user._id || srcReq.user.userId || srcReq.user?.user?._id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      proxyReqOpts.headers["x-user-id"] = String(userId);
      proxyReqOpts.headers["x-user-email"] = srcReq.user.email || srcReq.user?.user?.email || "";
      proxyReqOpts.headers["x-user-name"] = srcReq.user.name || srcReq.user?.user?.name || "";

      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization = srcReq.headers.authorization;
      }

      if (srcReq.headers.cookie) {
        proxyReqOpts.headers.cookie = srcReq.headers.cookie;
      }

      if (srcReq.headers["content-type"]) {
        proxyReqOpts.headers["content-type"] = srcReq.headers["content-type"];
      }

      return proxyReqOpts;
    },
    parseReqBody: false,
    proxyErrorHandler: (err, res) => {
      console.error("CV Proxy Error:", err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    },
  })
)

// ✅ PORTFOLIO - PAID - ORDER FIXED: checkCredits FIRST then trackActivity
app.use(
  "/portfolio",
  protect,
  checkCredits,      // ✅ PEHLE CREDITS DEDUCT KARO
  trackActivity,     // ✅ PHIR ACTIVITY TRACK KARO
  proxy(
    process.env.PORTFOLIO_SERVICES,
    {
      proxyReqPathResolver: (req) => {
        return `/api/portfolio${req.url}`;
      },
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        console.log("Portfolio User:", srcReq.user);

        if (!srcReq.user) {
          throw new Error("User not found");
        }

        const userId = srcReq.user._id || srcReq.user.userId || srcReq.user?.user?._id;

        if (!userId) {
          throw new Error("User ID not found");
        }

        proxyReqOpts.headers["x-user-id"] = String(userId);
        proxyReqOpts.headers["x-user-email"] = srcReq.user.email || srcReq.user?.user?.email || "";
        proxyReqOpts.headers["x-user-name"] = srcReq.user.name || srcReq.user?.user?.name || "";

        if (srcReq.headers.authorization) {
          proxyReqOpts.headers.authorization = srcReq.headers.authorization;
        }

        if (srcReq.headers.cookie) {
          proxyReqOpts.headers.cookie = srcReq.headers.cookie;
        }

        if (srcReq.headers["content-type"]) {
          proxyReqOpts.headers["content-type"] = srcReq.headers["content-type"];
        }

        return proxyReqOpts;
      },
      parseReqBody: false,
      proxyErrorHandler: (err, res) => {
        console.error("Portfolio Proxy Error:", err);
        res.status(500).json({
          success: false,
          message: err.message || "Portfolio service unavailable",
        });
      },
    }
  )
)

app.listen(PORT, () => {
  console.log(`✅ Gateway running on port ${PORT}`)
  console.log("====================================")
  console.log("📊 CREDIT SYSTEM STATUS")
  console.log("====================================")
  console.log("🆓 FREE Routes:")
  console.log("   /auth/*      - Authentication")
  console.log("   /me          - Current User")
  console.log("   /activity    - User Activity (FREE)")
  console.log("   /chat/*      - Chat Agent (FREE)")
  console.log("   /agent/*     - All Agents (FREE)")
  console.log("   /billing/*   - Billing (FREE)")
  console.log("   /resume/*    - GET routes (FREE)")
  console.log("====================================")
  console.log("💰 PAID Routes (2 Credits):")
  console.log("   /resume/upload - Resume Upload")
  console.log("   /portfolio/*   - Portfolio Service")
  console.log("   /cv/*          - CV Service")
  console.log("====================================")
  console.log("📈 Activity Tracking: ENABLED")
  console.log("====================================")
})