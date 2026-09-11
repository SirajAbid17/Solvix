import axios from "axios";
import redis from "../../shared/redis/redis.js";

// ============================================================
// SERVICE URLs
// ============================================================

const AUTH_SERVICE = process.env.Auth_Services || "http://localhost:5001";
const BILLING_SERVICE = process.env.BILLING_SERVICES || "http://localhost:5006";

// ============================================================
// HELPERS
// ============================================================

const fetchFromService = async (url, options = {}) => {
  try {
    const response = await axios({
      method: options.method || "GET",
      url,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      data: options.data,
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Service fetch error (${url}):`, error.message);
    return null;
  }
};

// ============================================================
// 1. GET ADMIN STATS
// ============================================================

export const getAdminStats = async (req, res) => {
  try {
    const cacheKey = "admin:stats";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const [users, billing] = await Promise.all([
      fetchFromService(`${AUTH_SERVICE}/admin/users/stats`),
      fetchFromService(`${BILLING_SERVICE}/admin/stats`),
    ]);

    let totalRequests = 0;
    try {
      const keys = await redis.keys("activity:*:total");
      for (const key of keys) {
        const count = await redis.get(key);
        totalRequests += parseInt(count) || 0;
      }
    } catch (e) {
      console.warn("Redis activity stats error:", e.message);
    }

    const stats = {
      totalUsers: users?.data?.totalUsers || 0,
      activeUsers: users?.data?.activeUsers || 0,
      adminUsers: users?.data?.adminUsers || 0,
      inactiveUsers: users?.data?.inactiveUsers || 0,
      suspendedUsers: users?.data?.suspendedUsers || 0,
      newUsersThisMonth: users?.data?.newUsersThisMonth || 0,
      totalCreditsUsed: users?.data?.totalCreditsUsed || 0,
      avgCreditsPerUser: users?.data?.avgCreditsPerUser || 0,
      totalRevenue: billing?.data?.totalRevenue || 0,
      totalAgents: 7,
      totalRequests: totalRequests || 0,
    };

    await redis.set(cacheKey, JSON.stringify(stats), "EX", 120);

    return res.status(200).json({
      success: true,
      fromCache: false,
      data: stats,
    });
  } catch (error) {
    console.error("Get Admin Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
    });
  }
};

// ============================================================
// 2. GET ADMIN USERS
// ============================================================

export const getAdminUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "" } = req.query;

    const cacheKey = `admin:users:${page}:${limit}:${search}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        ...JSON.parse(cached),
      });
    }

    const response = await fetchFromService(
      `${AUTH_SERVICE}/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );

    const result = {
      success: true,
      fromCache: false,
      users: response?.users || [],
      total: response?.total || 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: response?.totalPages || 0,
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 120);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Admin Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ============================================================
// 3. GET ADMIN TRANSACTIONS
// ============================================================

export const getAdminTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const cacheKey = `admin:transactions:${page}:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        ...JSON.parse(cached),
      });
    }

    const response = await fetchFromService(
      `${BILLING_SERVICE}/admin/transactions?page=${page}&limit=${limit}`
    );

    const result = {
      success: true,
      fromCache: false,
      data: response?.transactions || [],
      total: response?.total || 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: response?.totalPages || 0,
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 120);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Admin Transactions Error:", error);
    return res.status(200).json({
      success: true,
      data: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
    });
  }
};

// ============================================================
// 4. GET ADMIN ACTIVITIES
// ============================================================

export const getAdminActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const cacheKey = `admin:activities:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        ...JSON.parse(cached),
      });
    }

    const activityKeys = await redis.keys("activity:*:total");
    const activities = [];

    for (const key of activityKeys) {
      try {
        const parts = key.split(":");
        const userId = parts[1];
        const count = await redis.get(key);

        if (count && parseInt(count) > 0) {
          const userInfo = await fetchFromService(`${AUTH_SERVICE}/admin/user/${userId}`);
          
          if (userInfo?.success) {
            const user = userInfo.user || userInfo;
            activities.push({
              id: userId,
              user: user.name || "Unknown User",
              email: user.email || "",
              action: `Made ${count} requests`,
              time: "Just now",
              timestamp: new Date().toISOString(),
              requests: parseInt(count),
            });
          } else {
            activities.push({
              id: userId,
              user: "Unknown User",
              email: "",
              action: `Made ${count} requests`,
              time: "Just now",
              timestamp: new Date().toISOString(),
              requests: parseInt(count),
            });
          }
        }
      } catch (e) {
        console.warn("Activity processing error:", e.message);
      }
    }

    activities.sort((a, b) => (b.requests || 0) - (a.requests || 0));

    const result = {
      success: true,
      fromCache: false,
      data: activities.slice(0, Number(limit)),
      total: activities.length,
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Admin Activities Error:", error);
    return res.status(200).json({
      success: true,
      data: [],
      total: 0,
    });
  }
};

// ============================================================
// 5. GET AGENT USAGE
// ============================================================

export const getAdminAgentUsage = async (req, res) => {
  try {
    const cacheKey = "admin:agent-usage";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const agentKeys = await redis.keys("activity:*:service:*");
    const agentUsage = {};

    for (const key of agentKeys) {
      try {
        const parts = key.split(":");
        const agentName = parts[parts.length - 1];
        const count = await redis.get(key);
        
        if (count && parseInt(count) > 0) {
          agentUsage[agentName] = (agentUsage[agentName] || 0) + parseInt(count);
        }
      } catch (e) {
        // Ignore
      }
    }

    const allAgents = [
      { name: "Chat Agent", key: "Chat", color: "blue" },
      { name: "Search Agent", key: "Search", color: "green" },
      { name: "Coding Agent", key: "Coding", color: "purple" },
      { name: "Image Agent", key: "Image", color: "orange" },
      { name: "PDF Agent", key: "PDF", color: "red" },
      { name: "PPT Agent", key: "PPT", color: "pink" },
      { name: "Resume Agent", key: "Resume Analyzer", color: "teal" },
    ];

    const totalUsage = Object.values(agentUsage).reduce((sum, val) => sum + val, 0) || 1;

    const agents = allAgents.map((agent) => {
      const usage = agentUsage[agent.key] || 0;
      const percentage = Math.min(Math.round((usage / totalUsage) * 100), 100);
      return {
        name: agent.name,
        usage: percentage,
        color: agent.color,
        count: usage,
      };
    });

    agents.sort((a, b) => b.usage - a.usage);

    await redis.set(cacheKey, JSON.stringify(agents), "EX", 300);

    return res.status(200).json({
      success: true,
      fromCache: false,
      data: agents,
    });
  } catch (error) {
    console.error("Get Agent Usage Error:", error);
    const defaultAgents = [
      { name: "Chat Agent", usage: 85, color: "blue" },
      { name: "Search Agent", usage: 72, color: "green" },
      { name: "Coding Agent", usage: 68, color: "purple" },
      { name: "Image Agent", usage: 55, color: "orange" },
      { name: "PDF Agent", usage: 42, color: "red" },
      { name: "PPT Agent", usage: 38, color: "pink" },
      { name: "Resume Agent", usage: 90, color: "teal" },
    ];
    return res.status(200).json({
      success: true,
      data: defaultAgents,
    });
  }
};

// ============================================================
// 6. GET PLAN DISTRIBUTION
// ============================================================

export const getAdminPlanDistribution = async (req, res) => {
  try {
    const cacheKey = "admin:plan-distribution";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const response = await fetchFromService(`${AUTH_SERVICE}/admin/plan-distribution`);

    const plans = response?.plans || [];
    
    if (plans.length === 0) {
      const defaultPlans = [
        { name: "Free", count: 0, percentage: 0 },
        { name: "Starter", count: 0, percentage: 0 },
        { name: "Pro", count: 0, percentage: 0 },
      ];
      return res.status(200).json({
        success: true,
        data: defaultPlans,
      });
    }

    await redis.set(cacheKey, JSON.stringify(plans), "EX", 300);

    return res.status(200).json({
      success: true,
      fromCache: false,
      data: plans,
    });
  } catch (error) {
    console.error("Get Plan Distribution Error:", error);
    const defaultPlans = [
      { name: "Free", count: 0, percentage: 0 },
      { name: "Starter", count: 0, percentage: 0 },
      { name: "Pro", count: 0, percentage: 0 },
    ];
    return res.status(200).json({
      success: true,
      data: defaultPlans,
    });
  }
};

// ============================================================
// 7. UPDATE USER CREDITS
// ============================================================

export const updateUserCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;

    if (credits === undefined || credits < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid credits amount is required",
      });
    }

    const response = await fetchFromService(`${AUTH_SERVICE}/admin/user/${id}/credits`, {
      method: "PUT",
      data: { credits },
    });

    if (!response || !response.success) {
      return res.status(404).json({
        success: false,
        message: response?.message || "User not found",
      });
    }

    await redis.del("admin:stats");
    const keys = await redis.keys("admin:users:*");
    for (const key of keys) {
      await redis.del(key);
    }

    return res.status(200).json({
      success: true,
      message: "User credits updated successfully",
      data: response.user,
    });
  } catch (error) {
    console.error("Update User Credits Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user credits",
    });
  }
};

// ============================================================
// 8. UPDATE USER PLAN
// ============================================================

export const updateUserPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    const validPlans = ["free", "starter", "pro", "enterprise"];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type. Must be: free, starter, pro, enterprise",
      });
    }

    const response = await fetchFromService(`${AUTH_SERVICE}/admin/user/${id}/plan`, {
      method: "PUT",
      data: { plan },
    });

    if (!response || !response.success) {
      return res.status(404).json({
        success: false,
        message: response?.message || "User not found",
      });
    }

    await redis.del("admin:stats");
    await redis.del("admin:plan-distribution");
    const keys = await redis.keys("admin:users:*");
    for (const key of keys) {
      await redis.del(key);
    }

    return res.status(200).json({
      success: true,
      message: "User plan updated successfully",
      data: response.user,
    });
  } catch (error) {
    console.error("Update User Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user plan",
    });
  }
};

// ============================================================
// 9. TOGGLE USER STATUS
// ============================================================

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: active, inactive, suspended",
      });
    }

    const response = await fetchFromService(`${AUTH_SERVICE}/admin/user/${id}/status`, {
      method: "PATCH",
      data: { status },
    });

    if (!response || !response.success) {
      return res.status(404).json({
        success: false,
        message: response?.message || "User not found",
      });
    }

    await redis.del("admin:stats");
    const keys = await redis.keys("admin:users:*");
    for (const key of keys) {
      await redis.del(key);
    }

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: response.user,
    });
  } catch (error) {
    console.error("Toggle User Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

// ============================================================
// 10. DELETE USER
// ============================================================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetchFromService(`${AUTH_SERVICE}/admin/user/${id}`, {
      method: "DELETE",
    });

    if (!response || !response.success) {
      return res.status(404).json({
        success: false,
        message: response?.message || "User not found",
      });
    }

    await redis.del("admin:stats");
    const keys = await redis.keys("admin:users:*");
    for (const key of keys) {
      await redis.del(key);
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ============================================================
// 11. GET ADMIN SETTINGS - FIXED
// ============================================================

export const getAdminSettings = async (req, res) => {
  try {
    const cacheKey = "admin:settings";
    
    // ✅ Check if settings exist in Redis
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("📤 Returning cached settings");
      return res.status(200).json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    // ✅ Default settings if not found in Redis
    const settings = {
      maintenanceMode: false,
      newUserRegistration: true,
      freePlanCredits: 10,
      defaultLanguage: "en",
      emailNotifications: true,
      creditAlertThreshold: 5,
      maxFileSize: 10,
      allowedFileTypes: ["pdf", "png", "jpg", "jpeg", "doc", "docx"],
    };

    // ✅ Save defaults to Redis with 7 days expiry
    await redis.set(cacheKey, JSON.stringify(settings), "EX", 7 * 24 * 60 * 60);

    console.log("📤 Returning default settings");

    return res.status(200).json({
      success: true,
      fromCache: false,
      data: settings,
    });
  } catch (error) {
    console.error("❌ Get Admin Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// ============================================================
// 12. UPDATE ADMIN SETTINGS - FIXED
// ============================================================

export const updateAdminSettings = async (req, res) => {
  try {
    const settings = req.body;

    console.log("📥 Received settings update:", settings);

    // ✅ Validate settings
    if (settings.freePlanCredits !== undefined && settings.freePlanCredits < 0) {
      return res.status(400).json({
        success: false,
        message: "Free plan credits must be greater than or equal to 0",
      });
    }

    if (settings.maxFileSize !== undefined && settings.maxFileSize < 1) {
      return res.status(400).json({
        success: false,
        message: "Max file size must be at least 1 MB",
      });
    }

    // ✅ Save to Redis with 7 days expiry
    const cacheKey = "admin:settings";
    await redis.set(cacheKey, JSON.stringify(settings), "EX", 7 * 24 * 60 * 60);

    console.log("✅ Admin settings saved successfully:", settings);

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Update Admin Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update settings",
      error: error.message,
    });
  }
};