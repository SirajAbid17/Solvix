import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import redis from "../../../shared/redis/redis.js";
import dotenv from "dotenv";
dotenv.config();
// ✅ Admin emails list (Hardcoded - Simple way)
// You can also use database approach
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAILS,  
];

// ✅ Check if user is admin
const checkIsAdmin = (email) => {
  return ADMIN_EMAILS.includes(email);
};

/*
====================================================
LOGIN
====================================================
*/

export const Login = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token is required",
      });
    }

    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseId: decoded.uid,
    });

    /*
    ================================================
    CREATE USER
    ================================================
    */

    if (!user) {
      // ✅ Check if user is admin
      const isAdmin = checkIsAdmin(decoded.email);

      user = await User.create({
        firebaseId: decoded.uid,
        name: decoded.name || "",
        email: decoded.email || "",
        avatar: decoded.picture || "",
        plan: "free",
        credits: 10,
        totalcredits: 10,
        isAdmin: isAdmin, // ✅ Admin flag stored
      });

      console.log("✅ New user created");
      console.log("👤 User:", user._id);
      console.log("💳 Credits:", user.credits);
      console.log("📊 Total Credits:", user.totalcredits);
      console.log("👑 Is Admin:", user.isAdmin);
    }

    /*
    ================================================
    JWT SESSION
    ================================================
    */

    const sessionid = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    /*
    ================================================
    REDIS SESSION
    ================================================
    */

    await redis.set(
      `session-${sessionid}`,
      JSON.stringify({
        userId: user._id.toString(),
        firebaseId: user.firebaseId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalcredits: user.totalcredits,
        isAdmin: user.isAdmin || false, // ✅ Admin flag in Redis
      }),
      "EX",
      7 * 24 * 60 * 60
    );

    /*
    ================================================
    COOKIE
    ================================================
    */

    res.cookie("sessionid", sessionid, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    /*
    ================================================
    RESPONSE
    ================================================
    */

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        _id: user._id,
        firebaseId: user.firebaseId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalcredits: user.totalcredits,
        isAdmin: user.isAdmin || false, // ✅ Admin flag in response
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/*
====================================================
LOGOUT
====================================================
*/

export const Logout = async (req, res) => {
  try {
    const sessionid = req.cookies?.sessionid;

    if (sessionid) {
      await redis.del(`session-${sessionid}`);

      res.clearCookie("sessionid", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("❌ Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/*
====================================================
UPDATE USER AFTER PAYMENT
====================================================
*/

export const UpdateUserPayment = async (req, res) => {
  try {
    const {
      userId,
      firebaseId,
      plan,
      credits,
    } = req.body;

    /*
    ================================================
    VALIDATION
    ================================================
    */

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required",
      });
    }

    if (
      credits === undefined ||
      credits === null ||
      Number(credits) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid credits are required",
      });
    }

    const creditsToAdd = Number(credits);

    /*
    ================================================
    FIND USER
    ================================================
    */

    let user = null;

    // First try Mongo _id
    if (userId) {
      user = await User.findById(userId);
    }

    // Then try Firebase ID
    if (!user && firebaseId) {
      user = await User.findOne({
        firebaseId,
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
    ================================================
    OLD VALUES
    ================================================
    */

    const oldCredits = Number(user.credits || 0);
    const oldTotalCredits = Number(
      user.totalcredits || 0
    );

    /*
    ================================================
    UPDATE
    ================================================
    */

    user.plan = plan;

    user.credits =
      oldCredits + creditsToAdd;

    user.totalcredits =
      oldTotalCredits + creditsToAdd;

    await user.save();

    console.log("");
    console.log("====================================");
    console.log("✅ USER PAYMENT UPDATED");
    console.log("====================================");
    console.log("Mongo User ID:", user._id.toString());
    console.log("Firebase ID:", user.firebaseId);
    console.log("Plan:", user.plan);
    console.log("Old Credits:", oldCredits);
    console.log("Added Credits:", creditsToAdd);
    console.log("New Credits:", user.credits);
    console.log("Old Total:", oldTotalCredits);
    console.log("New Total:", user.totalcredits);
    console.log("====================================");

    /*
    ================================================
    UPDATE ALL REDIS SESSIONS
    ================================================
    */

    try {
      const keys = await redis.keys("session-*");

      for (const key of keys) {
        const session = await redis.get(key);

        if (!session) continue;

        const sessionData =
          JSON.parse(session);

        if (
          String(sessionData.userId) ===
          user._id.toString()
        ) {
          sessionData.plan = user.plan;
          sessionData.credits = user.credits;
          sessionData.totalcredits =
            user.totalcredits;
          sessionData.isAdmin = user.isAdmin || false; // ✅ Keep admin flag

          const ttl = await redis.ttl(key);

          if (ttl > 0) {
            await redis.set(
              key,
              JSON.stringify(sessionData),
              "EX",
              ttl
            );
          }
        }
      }

      console.log(
        "✅ Redis sessions updated"
      );
    } catch (redisError) {
      console.warn(
        "⚠️ Redis update failed:",
        redisError.message
      );
    }

    /*
    ================================================
    RESPONSE
    ================================================
    */

    return res.status(200).json({
      success: true,

      message:
        "User payment updated successfully",

      data: {
        user: {
          id: user._id,
          firebaseId: user.firebaseId,
          name: user.name,
          email: user.email,
          plan: user.plan,
          credits: user.credits,
          totalcredits: user.totalcredits,
          creditsAdded: creditsToAdd,
          isAdmin: user.isAdmin || false, // ✅ Admin flag in response
        },
      },
    });
  } catch (error) {
    console.error(
      "❌ UpdateUserPayment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update user payment",
    });
  }
};

/*
====================================================
GET USER CREDITS
====================================================
*/

export const GetUserCredits = async (
  req,
  res
) => {
  try {
    const { firebaseId } = req.params;

    const user = await User.findOne({
      firebaseId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      user: {
        _id: user._id,
        firebaseId: user.firebaseId,
        name: user.name,
        email: user.email,
        plan: user.plan,
        credits: user.credits,
        totalcredits: user.totalcredits,
        isAdmin: user.isAdmin || false, // ✅ Admin flag in response
      },
    });
  } catch (error) {
    console.error(
      "❌ Get User Credits Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================================
✅ DEDUCT CREDITS - NEW ENDPOINT
====================================================
*/

export const DeductCredits = async (req, res) => {
  try {
    const { userId, credits, deducted, service } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    if (credits === undefined || credits === null) {
      return res.status(400).json({
        success: false,
        message: "Credits amount is required"
      });
    }

    // Find user
    let user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update credits
    const oldCredits = Number(user.credits || 0);
    user.credits = Number(credits);
    await user.save();

    console.log("");
    console.log("====================================");
    console.log("💰 CREDITS DEDUCTED");
    console.log("====================================");
    console.log("User ID:", userId);
    console.log("Service:", service || "Unknown");
    console.log("Deducted:", deducted || 2);
    console.log("Old Credits:", oldCredits);
    console.log("New Credits:", user.credits);
    console.log("====================================");

    // Update ALL Redis sessions
    try {
      const keys = await redis.keys("session-*");
      
      for (const key of keys) {
        const session = await redis.get(key);
        if (!session) continue;
        
        const sessionData = JSON.parse(session);
        if (String(sessionData.userId) === String(userId)) {
          sessionData.credits = user.credits;
          sessionData.isAdmin = user.isAdmin || false; // ✅ Keep admin flag
          const ttl = await redis.ttl(key);
          if (ttl > 0) {
            await redis.set(key, JSON.stringify(sessionData), "EX", ttl);
          }
        }
      }
    } catch (redisError) {
      console.warn("⚠️ Redis update failed:", redisError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Credits deducted successfully",
      data: {
        userId: user._id,
        credits: user.credits,
        deducted: deducted || 2
      }
    });

  } catch (error) {
    console.error("❌ Deduct Credits Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to deduct credits"
    });
  }
};