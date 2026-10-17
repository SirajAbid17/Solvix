import redis from "../redis/redis.js";

const SERVICES = {
  
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

 
  "resume/upload": { name: "Resume Upload", type: "paid", credits: 2 },
  "cv/generate": { name: "CV Generator", type: "paid", credits: 2 },
  "cv": { name: "CV Generator", type: "paid", credits: 2 },
  "portfolio/upload": { name: "Portfolio Generator", type: "paid", credits: 2 },
  "portfolio": { name: "Portfolio Generator", type: "paid", credits: 2 },
  "mock-interview/generate": { name: "Mock Interview", type: "paid", credits: 2 },
};

const SKIP_ROUTES = ["/auth", "/me", "/activity", "/billing", "/admin"];

const detectService = (path) => {
  const lowerPath = path.toLowerCase();

  for (const route of SKIP_ROUTES) {
    if (lowerPath.startsWith(route) || lowerPath.includes(route)) {
      return { type: "skip", name: null };
    }
  }

  const sortedKeys = Object.keys(SERVICES).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (lowerPath.includes(key)) {
      return SERVICES[key];
    }
  }

  return { type: "skip", name: null };
};

function getWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}


export const trackActivity = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next();
    }

    const userId = user.userId || user._id;
    const path = req.path || req.originalUrl || "";

    const service = detectService(path);

    if (service.type === "skip") {
      return next();
    }

    const date = new Date();
    const today = date.toISOString().split("T")[0];
    const weekKey = getWeekKey(date);

    const pipeline = redis.pipeline();

    
    const totalKey = `activity:${userId}:total`;
    pipeline.incr(totalKey);
    pipeline.expire(totalKey, 60 * 60 * 24 * 365);

    const dailyKey = `activity:${userId}:daily:${today}`;
    pipeline.incr(dailyKey);
    pipeline.expire(dailyKey, 60 * 60 * 24 * 60);

    const weeklyKey = `activity:${userId}:weekly:${weekKey}`;
    pipeline.incr(weeklyKey);
    pipeline.expire(weeklyKey, 60 * 60 * 24 * 90);

  
    const userServiceKey = `activity:${userId}:service:${service.name}`;
    pipeline.incr(userServiceKey);

    
    const globalServiceKey = `admin:service-usage:${service.name}`;
    pipeline.incr(globalServiceKey);

   
    const globalTypeKey = `admin:type-count:${service.type}`;
    pipeline.incr(globalTypeKey);

    
    if (service.type === "paid") {
    
      pipeline.incr("admin:global:requests");
      pipeline.incr("admin:paid-requests-total");

      
      const paidDailyKey = `activity:${userId}:paid-daily:${today}`;
      pipeline.incr(paidDailyKey);
      pipeline.expire(paidDailyKey, 60 * 60 * 24 * 60);

      
      const paidWeeklyKey = `activity:${userId}:paid-weekly:${weekKey}`;
      pipeline.incr(paidWeeklyKey);
      pipeline.expire(paidWeeklyKey, 60 * 60 * 24 * 90);

   
      const paidTotalKey = `activity:${userId}:paid-requests`;
      pipeline.incr(paidTotalKey);
      pipeline.expire(paidTotalKey, 60 * 60 * 24 * 365);

    
      const paidServiceKey = `activity:${userId}:paid-service:${service.name}`;
      pipeline.incr(paidServiceKey);

      
      const creditsDeducted = req.creditsDeducted || service.credits || 2;
      const remainingCredits = req.remainingCredits || 0;

      const creditKey = `activity:${userId}:credits:used`;
      pipeline.incrby(creditKey, creditsDeducted);

      pipeline.incrby("admin:global:credits-used", creditsDeducted);


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

    await pipeline.exec();

    next();
  } catch (error) {
    next();
  }
};


export const getUserActivity = async (userId) => {
  try {
    const totalKey = `activity:${userId}:total`;
    const paidTotalKey = `activity:${userId}:paid-requests`;
    const creditKey = `activity:${userId}:credits:used`;
    const creditHistoryKey = `activity:${userId}:credit-history`;

   
    const serviceKeys = await redis.keys(`activity:${userId}:service:*`);
    const serviceUsage = {};
    for (const key of serviceKeys) {
      const service = key.split(":").pop();
      const count = (await redis.get(key)) || 0;
      if (parseInt(count) > 0) {
        serviceUsage[service] = parseInt(count);
      }
    }

   
    const paidServiceKeys = await redis.keys(
      `activity:${userId}:paid-service:*`
    );
    const paidServiceUsage = {};
    for (const key of paidServiceKeys) {
      const service = key.split(":").pop();
      const count = (await redis.get(key)) || 0;
      if (parseInt(count) > 0) {
        paidServiceUsage[service] = parseInt(count);
      }
    }

   
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

  
    const paidDailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayKey = `activity:${userId}:paid-daily:${dateStr}`;
      const count = (await redis.get(dayKey)) || 0;
      paidDailyData.push({
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: parseInt(count),
      });
    }


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

   
    const paidWeeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      const weekKey = getWeekKey(date);
      const weekCount =
        (await redis.get(`activity:${userId}:paid-weekly:${weekKey}`)) || 0;
      paidWeeklyData.push({
        week: weekKey,
        label: `Week ${weekKey.split("-W")[1]}`,
        count: parseInt(weekCount),
      });
    }

    
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
    const paidRequests = parseInt((await redis.get(paidTotalKey)) || 0);
    const totalCreditsUsed = parseInt((await redis.get(creditKey)) || 0);

    return {
      
      totalRequests,
      serviceUsage,
      dailyData,
      weeklyData,

     
      paidRequests,
      paidServiceUsage,
      paidDailyData,
      paidWeeklyData,

      totalCreditsUsed,
      creditHistory: parsedCreditHistory,
    };
  } catch (error) {
    console.error("getUserActivity error:", error);
    return null;
  }
};


export const getAgentUsageFromRedis = async () => {
  try {
    const serviceKeys = await redis.keys("admin:service-usage:*");
    const usage = {};

    for (const key of serviceKeys) {
      const serviceName = key.replace("admin:service-usage:", "");
      const count = parseInt((await redis.get(key)) || 0);

      if (count > 0) {
        usage[serviceName] = count;
      }
    }

    const paidCount = parseInt((await redis.get("admin:type-count:paid")) || 0);
    const freeCount = parseInt((await redis.get("admin:type-count:free")) || 0);

    console.log(`Paid total: ${paidCount}`);
    console.log(`Free total: ${freeCount}`);

    return usage;
  } catch (error) {
    return {};
  }
};


export const getAllAgentStats = async () => {
  try {
    const ALL_AGENTS = [
      { name: "Chat Agent", type: "free" },
      { name: "Search Agent", type: "free" },
      { name: "Coding Agent", type: "free" },
      { name: "Image Agent", type: "free" },
      { name: "PDF Agent", type: "free" },
      { name: "PPT Agent", type: "free" },
      { name: "Resume Analyzer", type: "free" },

      { name: "Resume Upload", type: "paid" },
      { name: "CV Generator", type: "paid" },
      { name: "Portfolio Generator", type: "paid" },
      { name: "Mock Interview", type: "paid" },
    ];

    const usage = await getAgentUsageFromRedis();

    const totalUsage =
      Object.values(usage).reduce((sum, val) => sum + val, 0) || 1;

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

    result.sort((a, b) => {
      if (a.type === "paid" && b.type !== "paid") return -1;
      if (a.type !== "paid" && b.type === "paid") return 1;
      return b.count - a.count;
    });

    return result;
  } catch (error) {
    console.error("Get all agent stats error:", error);
    return [];
  }
};