import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import redis from "../../../shared/redis/redis.js";
dotenv.config();


const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
  : [];

const checkIsAdmin = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};


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


    if (!user) {
      const isAdmin = checkIsAdmin(decoded.email);

      user = await User.create({
        firebaseId: decoded.uid,
        name: decoded.name || "",
        email: decoded.email || "",
        avatar: decoded.picture || "",
        plan: "free",
        credits: 10,
        totalcredits: 10,
        isAdmin: isAdmin,
        status: "active",
      });

      
    }

    

    const sessionid = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  

    await redis.set(
      `session-${sessionid}`,
      JSON.stringify({
        userId: user._id.toString(),
        _id: user._id.toString(),
        firebaseId: user.firebaseId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalcredits: user.totalcredits,
        isAdmin: user.isAdmin || false,
        status: user.status || "active",
      }),
      "EX",
      7 * 24 * 60 * 60
    );

    res.cookie("sessionid", sessionid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

  

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
        isAdmin: user.isAdmin || false,
        status: user.status || "active",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};


export const Logout = async (req, res) => {
  try {
    const sessionid = req.cookies?.sessionid;

    if (sessionid) {
      await redis.del(`session-${sessionid}`);
      res.clearCookie("sessionid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


export const UpdateUserPayment = async (req, res) => {
  try {
    const { userId, firebaseId, plan, credits } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required",
      });
    }

    if (credits === undefined || credits === null || Number(credits) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid credits are required",
      });
    }

    const creditsToAdd = Number(credits);
    let user = null;

    if (userId) {
      user = await User.findById(userId);
    }

    if (!user && firebaseId) {
      user = await User.findOne({ firebaseId });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldCredits = Number(user.credits || 0);
    const oldTotalCredits = Number(user.totalcredits || 0);

    user.plan = plan;
    user.credits = oldCredits + creditsToAdd;
    user.totalcredits = oldTotalCredits + creditsToAdd;
    await user.save();

   
    try {
      const keys = await redis.keys("session-*");
      for (const key of keys) {
        const session = await redis.get(key);
        if (!session) continue;
        const sessionData = JSON.parse(session);
        if (String(sessionData.userId) === user._id.toString()) {
          sessionData.plan = user.plan;
          sessionData.credits = user.credits;
          sessionData.totalcredits = user.totalcredits;
          const ttl = await redis.ttl(key);
          if (ttl > 0) {
            await redis.set(key, JSON.stringify(sessionData), "EX", ttl);
          }
        }
      }
    } catch (redisError) {
      console.warn("Redis update failed:", redisError.message);
    }

    return res.status(200).json({
      success: true,
      message: "User payment updated successfully",
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
          isAdmin: user.isAdmin || false,
        },
      },
    });
  } catch (error) {
    console.error("UpdateUserPayment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user payment",
    });
  }
};


export const GetUserCredits = async (req, res) => {
  try {
    const { firebaseId } = req.params;
    const user = await User.findOne({ firebaseId });

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
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (error) {
    console.error("Get User Credits Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const DeductCredits = async (req, res) => {
  try {
    const { userId, credits, deducted, service } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (credits === undefined || credits === null) {
      return res.status(400).json({
        success: false,
        message: "Credits amount is required",
      });
    }

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldCredits = Number(user.credits || 0);
    user.credits = Number(credits);
    await user.save();

    console.log(`Credits deducted: ${deducted || 2} | ${oldCredits} → ${user.credits} | User: ${userId}`);

    
    try {
      const keys = await redis.keys("session-*");
      for (const key of keys) {
        const session = await redis.get(key);
        if (!session) continue;
        const sessionData = JSON.parse(session);
        if (String(sessionData.userId) === String(userId)) {
          sessionData.credits = user.credits;
          const ttl = await redis.ttl(key);
          if (ttl > 0) {
            await redis.set(key, JSON.stringify(sessionData), "EX", ttl);
          }
        }
      }
    } catch (redisError) {
      console.warn("Redis update failed:", redisError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Credits deducted successfully",
      data: {
        userId: user._id,
        credits: user.credits,
        deducted: deducted || 2,
      },
    });
  } catch (error) {
    console.error("Deduct Credits Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to deduct credits",
    });
  }
};


export const getAdminUsersStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ isAdmin: false, status: "active" });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const inactiveUsers = await User.countDocuments({ status: "inactive" });
    const suspendedUsers = await User.countDocuments({ status: "suspended" });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const users = await User.find({}).select("credits totalcredits");
    let totalCreditsUsed = 0;
    let totalCredits = 0;

    for (const user of users) {
      const used = (user.totalcredits || 0) - (user.credits || 0);
      totalCreditsUsed += Math.max(0, used);
      totalCredits += user.totalcredits || 0;
    }

    const avgCreditsPerUser = totalUsers > 0 ? Math.round(totalCredits / totalUsers) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        inactiveUsers,
        suspendedUsers,
        newUsersThisMonth,
        totalCreditsUsed,
        avgCreditsPerUser,
      },
    });
  } catch (error) {
    console.error("Get Admin Users Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAdminUsersList = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "" } = req.query;

    const query = {};
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    
    const userIds = users.map((u) => u._id.toString());
    const activityCounts = {};

    try {
      const keys = await redis.keys("activity:*:total");
      for (const key of keys) {
        const parts = key.split(":");
        const uid = parts[1];
        if (userIds.includes(uid)) {
          const count = await redis.get(key);
          activityCounts[uid] = parseInt(count) || 0;
        }
      }
    } catch (e) {
      console.warn("Redis activity fetch error:", e.message);
    }

    const formattedUsers = users.map((user) => ({
      id: user._id,
      _id: user._id,
      name: user.name || "Unknown User",
      email: user.email || "",
      plan: user.plan || "free",
      credits: user.credits || 0,
      totalCredits: user.totalcredits || 0,
      status: user.isAdmin ? "admin" : user.status || "active",
      isAdmin: user.isAdmin || false,
      requests: activityCounts[user._id.toString()] || 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      users: formattedUsers,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get Admin Users List Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let requestCount = 0;
    try {
      const totalKey = `activity:${user._id}:total`;
      const count = await redis.get(totalKey);
      requestCount = parseInt(count) || 0;
    } catch (e) {
     
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name || "Unknown User",
        email: user.email || "",
        plan: user.plan || "free",
        credits: user.credits || 0,
        totalCredits: user.totalcredits || 0,
        isAdmin: user.isAdmin || false,
        status: user.status || "active",
        requests: requestCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateUserCreditsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;

    if (credits === undefined || credits < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid credits amount is required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldCredits = user.credits || 0;
    user.credits = credits;
    await user.save();

   
    try {
      const keys = await redis.keys("session-*");
      for (const key of keys) {
        const session = await redis.get(key);
        if (session) {
          const sessionData = JSON.parse(session);
          if (String(sessionData.userId) === String(user._id)) {
            sessionData.credits = credits;
            const ttl = await redis.ttl(key);
            if (ttl > 0) {
              await redis.set(key, JSON.stringify(sessionData), "EX", ttl);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Redis session update failed:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "User credits updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        oldCredits,
      },
    });
  } catch (error) {
    console.error("Update User Credits Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateUserPlanAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    const validPlans = ["free", "starter", "pro", "enterprise"];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldPlan = user.plan;
    user.plan = plan;
    await user.save();

   
    try {
      const keys = await redis.keys("session-*");
      for (const key of keys) {
        const session = await redis.get(key);
        if (session) {
          const sessionData = JSON.parse(session);
          if (String(sessionData.userId) === String(user._id)) {
            sessionData.plan = plan;
            const ttl = await redis.ttl(key);
            if (ttl > 0) {
              await redis.set(key, JSON.stringify(sessionData), "EX", ttl);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Redis session update failed:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "User plan updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        oldPlan,
      },
    });
  } catch (error) {
    console.error("Update User Plan Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const toggleUserStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Cannot change status of admin users",
      });
    }

    const oldStatus = user.status || "active";
    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status updated from ${oldStatus} to ${status}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status,
        oldStatus,
      },
    });
  } catch (error) {
    console.error("Toggle User Status Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    await User.findByIdAndDelete(id);

  
    try {
      const keys = await redis.keys("session-*");
      for (const key of keys) {
        const session = await redis.get(key);
        if (session) {
          const sessionData = JSON.parse(session);
          if (String(sessionData.userId) === String(id)) {
            await redis.del(key);
          }
        }
      }
      const activityKeys = await redis.keys(`activity:${id}:*`);
      for (const key of activityKeys) {
        await redis.del(key);
      }
    } catch (error) {
      console.warn("Redis cleanup failed:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getPlanDistribution = async (req, res) => {
  try {
    const users = await User.find({}).select("plan");
    const planCount = {};

    for (const user of users) {
      const plan = user.plan || "free";
      planCount[plan] = (planCount[plan] || 0) + 1;
    }

    const total = users.length || 1;
    const plans = Object.keys(planCount).map((name) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count: planCount[name],
      percentage: Math.round((planCount[name] / total) * 100),
    }));

    plans.sort((a, b) => b.count - a.count);

    return res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Get Plan Distribution Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalKey = `activity:${id}:total`;
    const totalRequests = parseInt(await redis.get(totalKey) || 0);

    const serviceKeys = await redis.keys(`activity:${id}:service:*`);
    const services = {};
    for (const key of serviceKeys) {
      const service = key.split(":").pop();
      const count = parseInt(await redis.get(key) || 0);
      services[service] = count;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalRequests,
        services,
      },
    });
  } catch (error) {
    console.error("Get User Activity Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};