import redis from "../redis/redis.js";

// ============================================================
// ✅ PAID SERVICES LIST - SIRF YEH COUNT HONGI
// ============================================================

const PAID_SERVICES = [
  'resume/upload',
  'cv',
  'portfolio',
  'resume-upload',
  'cv-generator',
  'portfolio-generator',
   'mock-interview/generate',  // ✅ ADDED
  'mock-interview/generate',  // ✅ ADDED
];

// ============================================================
// ✅ FREE SERVICES LIST - YEH COUNT NAHI HONGI
// ============================================================

const FREE_SERVICES = [
  'chat',
  'agent',
  'billing',
  'auth',
  'activity',
  'me',
  'get-conversation',
  'get-messages',
  'create-conversation',
  'search',
  'image',
  'coding',
  'ppt',
  'pdf',
];

// ============================================================
// ✅ CHECK IF SERVICE IS PAID
// ============================================================

const isPaidService = (path) => {
  return PAID_SERVICES.some(service => path.includes(service));
};

// ============================================================
// ✅ GET SERVICE NAME
// ============================================================

const getServiceName = (path) => {
  if (path.includes('resume/upload')) return 'Resume Upload';
  if (path.includes('resume')) return 'Resume';
  if (path.includes('cv')) return 'CV Generator';
  if (path.includes('portfolio')) return 'Portfolio Generator';
  if (path.includes('mock-interview')) return 'Mock Interview';
  return path.split('/')[1] || 'Unknown';
};

// ============================================================
// ✅ ACTIVITY TRACKING MIDDLEWARE - SIRF PAID SERVICES
// ============================================================

export const trackActivity = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return next();
    }

    const userId = user.userId || user._id;
    const path = req.path || req.originalUrl || '';
    
    // ✅ CHECK: SIRF PAID SERVICES COUNT KAREIN
    if (!isPaidService(path)) {
      console.log(`⏭️ SKIPPING activity for FREE service: ${path}`);
      return next();
    }

    console.log(`💰 COUNTING activity for PAID service: ${path}`);

    const service = getServiceName(path);
    const date = new Date();
    const today = date.toISOString().split('T')[0];
    const weekKey = getWeekKey(date);

    // ✅ 1. TOTAL REQUESTS COUNT (SIRF PAID)
    const totalKey = `activity:${userId}:total`;
    await redis.incr(totalKey);
    await redis.expire(totalKey, 60 * 60 * 24 * 365);

    // ✅ 2. DAILY REQUESTS (SIRF PAID)
    const dailyKey = `activity:${userId}:daily:${today}`;
    await redis.incr(dailyKey);
    await redis.expire(dailyKey, 60 * 60 * 24 * 60);

    // ✅ 3. WEEKLY REQUESTS (SIRF PAID)
    const weeklyKey = `activity:${userId}:weekly:${weekKey}`;
    await redis.incr(weeklyKey);
    await redis.expire(weeklyKey, 60 * 60 * 24 * 90);

    // ✅ 4. SERVICE SPECIFIC (SIRF PAID)
    const serviceKey = `activity:${userId}:service:${service}`;
    await redis.incr(serviceKey);

    // ✅ 5. CREDIT USAGE - Check if credits were deducted
    const creditsDeducted = req.creditsDeducted || 0;
    const remainingCredits = req.remainingCredits || 0;
    
    if (creditsDeducted > 0) {
      // Update total credits used
      const creditKey = `activity:${userId}:credits:used`;
      await redis.incrby(creditKey, creditsDeducted);
      
      // Add to credit history
      const creditHistoryKey = `activity:${userId}:credit-history`;
      const historyItem = JSON.stringify({
        service: service,
        credits: creditsDeducted,
        remaining: remainingCredits,
        timestamp: date.toISOString()
      });
      await redis.lpush(creditHistoryKey, historyItem);
      await redis.ltrim(creditHistoryKey, 0, 99);
    }

    console.log(`✅ Activity recorded for ${service}: +1 request`);

    next();

  } catch (error) {
    console.error("❌ Activity tracking error:", error);
    next();
  }
};

// ============================================================
// ✅ HELPER: Get Week Key
// ============================================================

function getWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

// ============================================================
// ✅ GET USER ACTIVITY DATA
// ============================================================

export const getUserActivity = async (userId) => {
  try {
    const totalKey = `activity:${userId}:total`;
    const creditKey = `activity:${userId}:credits:used`;
    const creditHistoryKey = `activity:${userId}:credit-history`;

    const serviceKeys = await redis.keys(`activity:${userId}:service:*`);
    
    // ✅ Daily data (last 7 days)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayKey = `activity:${userId}:daily:${dateStr}`;
      const count = await redis.get(dayKey) || 0;
      dailyData.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: parseInt(count)
      });
    }

    // ✅ Weekly data (last 4 weeks)
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      const weekKey = getWeekKey(date);
      const weekCount = await redis.get(`activity:${userId}:weekly:${weekKey}`) || 0;
      weeklyData.push({
        week: weekKey,
        label: `Week ${weekKey.split('-W')[1]}`,
        count: parseInt(weekCount)
      });
    }

    // ✅ Service usage - SIRF PAID SERVICES
    const serviceUsage = {};
    const serviceNameMap = {
      'Resume Upload': 'Resume Upload',
      'Resume': 'Resume Analyzer',
      'CV Generator': 'CV Generator',
      'Portfolio Generator': 'Portfolio Generator',
      'Mock Interview': 'Mock Interview',
    };
    
    for (const key of serviceKeys) {
      const service = key.split(':').pop();
      const count = await redis.get(key) || 0;
      const displayName = serviceNameMap[service] || service;
      if (parseInt(count) > 0) {
        serviceUsage[displayName] = parseInt(count);
      }
    }

    // ✅ Credit history
    const creditHistory = await redis.lrange(creditHistoryKey, 0, 49);
    const parsedCreditHistory = creditHistory.map(item => {
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    }).filter(Boolean);

    const totalRequests = parseInt(await redis.get(totalKey) || 0);
    const totalCreditsUsed = parseInt(await redis.get(creditKey) || 0);

    return {
      totalRequests,
      totalCreditsUsed,
      dailyData,
      weeklyData,
      serviceUsage,
      creditHistory: parsedCreditHistory
    };

  } catch (error) {
    console.error("❌ Get user activity error:", error);
    return null;
  }
};