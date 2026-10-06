import redis from "../redis/redis.js";


// ============================================================
// ✅ SERVICE CONFIG - YE SAB AGENTS HAI
// ============================================================

const SERVICES = {
  // 🆓 FREE SERVICES (No credits)
  "chat": { name: "Chat Agent", type: "free" },
  "agent/chat": { name: "Chat Agent", type: "free" },
  "get-conversation": { name: "Chat Agent", type: "free" },
  "create-conversation": { name: "Chat Agent", type: "free" },
  "get-messages": { name: "Chat Agent", type: "free" },
  "update-conversation": { name: "Chat Agent", type: "free" },
  
  "agent/search": { name: "Search Agent", type: "free" },
  "search": { name: "Search Agent", type: "free" },
  
  "agent/coding": { name: "Coding Agent", type: "free" },
  "coding": { name: "Coding Agent", type: "free" },
  
  "agent/image": { name: "Image Agent", type: "free" },
  "image": { name: "Image Agent", type: "free" },
  
  "agent/pdf": { name: "PDF Agent", type: "free" },
  "pdf": { name: "PDF Agent", type: "free" },
  
  "agent/ppt": { name: "PPT Agent", type: "free" },
  "ppt": { name: "PPT Agent", type: "free" },
  
  "agent/resume": { name: "Resume Analyzer", type: "free" },

  // 💰 PAID SERVICES (2 credits each)
  "resume/upload": { name: "Resume Upload", type: "paid", credits: 2 },
  "cv/generate": { name: "CV Generator", type: "paid", credits: 2 },
  "cv": { name: "CV Generator", type: "paid", credits: 2 },
  "portfolio/upload": { name: "Portfolio Generator", type: "paid", credits: 2 },
  "portfolio": { name: "Portfolio Generator", type: "paid", credits: 2 },
  "mock-interview/generate": { name: "Mock Interview", type: "paid", credits: 2 },
};

// ============================================================
// ✅ ROUTES TO SKIP (No tracking)
// ============================================================

const SKIP_ROUTES = [
  "/auth",
  "/me",
  "/activity",
  "/billing",
  "/admin",
];

// ============================================================
// ✅ DETECT SERVICE
// ============================================================

const detectService = (path) => {
  const lowerPath = path.toLowerCase();

  // Skip routes
  for (const route of SKIP_ROUTES) {
    if (lowerPath.startsWith(route) || lowerPath.includes(route)) {
      return { type: "skip", name: null };
    }
  }

  // Check services (longest match first)
  const sortedKeys = Object.keys(SERVICES).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (lowerPath.includes(key)) {
      return SERVICES[key];
    }
  }

  return { type: "skip", name: null };
};

// ============================================================
// ✅ GET WEEK KEY
// ============================================================

function getWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

// ============================================================
// ✅ ACTIVITY TRACKING MIDDLEWARE
// ============================================================

export const trackActivity = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next();
    }

    const userId = user.userId || user._id;
    const path = req.path || req.originalUrl || "";

    const service = detectService(path);

    // Skip free routes
    if (service.type === "skip") {
      console.log(`⏭️ SKIP: ${path}`);
      return next();
    }

    console.log(`📊 TRACK (${service.type}): ${path} → ${service.name}`);

    const date = new Date();
    const today = date.toISOString().split("T")[0];
    const weekKey = getWeekKey(date);

    const pipeline = redis.pipeline();

    // 1. User total requests
    const totalKey = `activity:${userId}:total`;
    pipeline.incr(totalKey);
    pipeline.expire(totalKey, 60 * 60 * 24 * 365);

    // 2. User daily requests
    const dailyKey = `activity:${userId}:daily:${today}`;
    pipeline.incr(dailyKey);
    pipeline.expire(dailyKey, 60 * 60 * 24 * 60);

    // 3. User weekly requests
    const weeklyKey = `activity:${userId}:weekly:${weekKey}`;
    pipeline.incr(weeklyKey);
    pipeline.expire(weeklyKey, 60 * 60 * 24 * 90);

    // 4. User service-specific count
    const userServiceKey = `activity:${userId}:service:${service.name}`;
    pipeline.incr(userServiceKey);

    // 5. 🌟 GLOBAL SERVICE USAGE (for admin panel)
    const globalServiceKey = `admin:service-usage:${service.name}`;
    pipeline.incr(globalServiceKey);

    // 6. 🌟 GLOBAL TYPE COUNT (paid vs free)
    const globalTypeKey = `admin:type-count:${service.type}`;
    pipeline.incr(globalTypeKey);

    // 7. 🌟 GLOBAL TOTAL REQUESTS
    pipeline.incr("admin:global:requests");

    // 8. Credit usage (only for paid)
    if (service.type === "paid") {
      const creditsDeducted = req.creditsDeducted || service.credits || 2;
      const remainingCredits = req.remainingCredits || 0;

      const creditKey = `activity:${userId}:credits:used`;
      pipeline.incrby(creditKey, creditsDeducted);

      // Global credits used
      pipeline.incrby("admin:global:credits-used", creditsDeducted);

      // Credit history
      const creditHistoryKey = `activity:${userId}:credit-history`;
      const historyItem = JSON.stringify({
        service: service.name,
        credits: creditsDeducted,
        remaining: remainingCredits,
        timestamp: date.toISOString(),
      });
      pipeline.lpush(creditHistoryKey, historyItem);
      pipeline.ltrim(creditHistoryKey, 0, 99);
    }

    // 9. 🌟 GLOBAL PAID SERVICE REVENUE TRACKING
    if (service.type === "paid") {
      pipeline.incr("admin:paid-requests-total");
    }

    await pipeline.exec();

    console.log(`✅ Tracked: ${service.name} (${service.type})`);

    next();
  } catch (error) {
    console.error("❌ Activity tracking error:", error);
    next();
  }
};

// ============================================================
// ✅ GET USER ACTIVITY DATA
// ============================================================

export const getUserActivity = async (userId) => {
  try {
    const totalKey = `activity:${userId}:total`;
    const creditKey = `activity:${userId}:credits:used`;
    const creditHistoryKey = `activity:${userId}:credit-history`;

    const serviceKeys = await redis.keys(`activity:${userId}:service:*`);

    // Daily data (last 7 days)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayKey = `activity:${userId}:daily:${dateStr}`;
      const count = (await redis.get(dayKey)) || 0;
      dailyData.push({
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: parseInt(count),
      });
    }

    // Weekly data (last 4 weeks)
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      const weekKey = getWeekKey(date);
      const weekCount =
        (await redis.get(`activity:${userId}:weekly:${weekKey}`)) || 0;
      weeklyData.push({
        week: weekKey,
        label: `Week ${weekKey.split("-W")[1]}`,
        count: parseInt(weekCount),
      });
    }

    // Service usage
    const serviceUsage = {};
    for (const key of serviceKeys) {
      const service = key.split(":").pop();
      const count = (await redis.get(key)) || 0;
      if (parseInt(count) > 0) {
        serviceUsage[service] = parseInt(count);
      }
    }

    // Credit history
    const creditHistory = await redis.lrange(creditHistoryKey, 0, 49);
    const parsedCreditHistory = creditHistory
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const totalRequests = parseInt((await redis.get(totalKey)) || 0);
    const totalCreditsUsed = parseInt((await redis.get(creditKey)) || 0);

    return {
      totalRequests,
      totalCreditsUsed,
      dailyData,
      weeklyData,
      serviceUsage,
      creditHistory: parsedCreditHistory,
    };
  } catch (error) {
    console.error("❌ Get user activity error:", error);
    return null;
  }
};

// ============================================================
// ✅ GET AGENT USAGE FOR ADMIN - FIXED
// ============================================================

export const getAgentUsageFromRedis = async () => {
  try {
    // Get all global service usage keys
    const serviceKeys = await redis.keys("admin:service-usage:*");
    const usage = {};

    console.log(`📊 Found ${serviceKeys.length} service keys in Redis`);

    for (const key of serviceKeys) {
      const serviceName = key.replace("admin:service-usage:", "");
      const count = parseInt((await redis.get(key)) || 0);

      if (count > 0) {
        usage[serviceName] = count;
        console.log(`   → ${serviceName}: ${count}`);
      }
    }

    // Also get paid/free type counts
    const paidCount = parseInt((await redis.get("admin:type-count:paid")) || 0);
    const freeCount = parseInt((await redis.get("admin:type-count:free")) || 0);

    console.log(`   → Paid total: ${paidCount}`);
    console.log(`   → Free total: ${freeCount}`);

    return usage;
  } catch (error) {
    console.error("❌ Get agent usage error:", error);
    return {};
  }
};

// ============================================================
// ✅ GET ALL AGENT STATS - FOR ADMIN PANEL
// ============================================================

export const getAllAgentStats = async () => {
  try {
    // All agents list
    const ALL_AGENTS = [
      // Free
      { name: "Chat Agent", type: "free" },
      { name: "Search Agent", type: "free" },
      { name: "Coding Agent", type: "free" },
      { name: "Image Agent", type: "free" },
      { name: "PDF Agent", type: "free" },
      { name: "PPT Agent", type: "free" },
      { name: "Resume Analyzer", type: "free" },
      // Paid
      { name: "Resume Upload", type: "paid" },
      { name: "CV Generator", type: "paid" },
      { name: "Portfolio Generator", type: "paid" },
      { name: "Mock Interview", type: "paid" },
    ];

    // Get usage from Redis
    const usage = await getAgentUsageFromRedis();

    // Calculate total for percentage
    const totalUsage = Object.values(usage).reduce((sum, val) => sum + val, 0) || 1;

    // Build result
    const result = ALL_AGENTS.map((agent) => {
      const count = usage[agent.name] || 0;
      const percentage = Math.round((count / totalUsage) * 100);

      return {
        name: agent.name,
        type: agent.type,
        count: count,
        usage: count > 0 ? percentage : 0,
      };
    });

    // Sort: paid first, then by count
    result.sort((a, b) => {
      if (a.type === "paid" && b.type !== "paid") return -1;
      if (a.type !== "paid" && b.type === "paid") return 1;
      return b.count - a.count;
    });

    console.log("📊 Final agent stats:", result);

    return result;
  } catch (error) {
    console.error("❌ Get all agent stats error:", error);
    return [];
  }
};