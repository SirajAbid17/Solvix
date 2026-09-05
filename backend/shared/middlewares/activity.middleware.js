import redis from "../redis/redis.js";

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
    
    // ✅ SERVICE NAME EXTRACTION
    let service = req.path.split('/')[1] || 'unknown';
    
    // ✅ MAP RAW PATHS TO FRIENDLY NAMES
    const serviceMap = {
      'chat': 'Chat',
      'agent': 'Agent',
      'resume': 'Resume',
      'portfolio': 'Portfolio',
      'cv': 'CV',
      'billing': 'Billing',
      'auth': 'Auth',
      'activity': 'Activity'
    };
    
    // ✅ FOR SPECIFIC ROUTES
    if (req.path.includes('/resume/upload')) {
      service = 'Resume Upload';
    } else if (req.path.includes('/chat/get-conversation')) {
      service = 'Chat';
    } else if (req.path.includes('/chat/save-messages')) {
      service = 'Chat';
    } else if (req.path.includes('/chat/get-messages')) {
      service = 'Chat';
    } else if (req.path.includes('/agent/chat')) {
      service = 'Agent';
    } else {
      service = serviceMap[service] || service.charAt(0).toUpperCase() + service.slice(1);
    }

    const date = new Date();
    const today = date.toISOString().split('T')[0];
    const weekKey = getWeekKey(date);

    // ✅ 1. TOTAL REQUESTS COUNT
    const totalKey = `activity:${userId}:total`;
    await redis.incr(totalKey);
    await redis.expire(totalKey, 60 * 60 * 24 * 365);

    // ✅ 2. DAILY REQUESTS
    const dailyKey = `activity:${userId}:daily:${today}`;
    await redis.incr(dailyKey);
    await redis.expire(dailyKey, 60 * 60 * 24 * 60);

    // ✅ 3. WEEKLY REQUESTS
    const weeklyKey = `activity:${userId}:weekly:${weekKey}`;
    await redis.incr(weeklyKey);
    await redis.expire(weeklyKey, 60 * 60 * 24 * 90);

    // ✅ 4. SERVICE SPECIFIC
    const serviceKey = `activity:${userId}:service:${service}`;
    await redis.incr(serviceKey);

    // ✅ 5. CREDIT USAGE - Check if credits were deducted
    const creditsDeducted = req.creditsDeducted || 0;
    const remainingCredits = req.remainingCredits || 0;
    
    if (creditsDeducted > 0) {
      // ✅ Update total credits used
      const creditKey = `activity:${userId}:credits:used`;
      await redis.incrby(creditKey, creditsDeducted);
      
      // ✅ Add to credit history
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

    // ✅ Service usage
    const serviceUsage = {};
    const serviceNameMap = {
      'Chat': 'Chat',
      'Agent': 'Agent',
      'Resume': 'Resume',
      'Resume Upload': 'Resume Upload',
      'Portfolio': 'Portfolio',
      'CV': 'CV',
      'Billing': 'Billing',
      'Auth': 'Auth',
      'Activity': 'Activity'
    };
    
    for (const key of serviceKeys) {
      const service = key.split(':').pop();
      const count = await redis.get(key) || 0;
      const displayName = serviceNameMap[service] || service;
      serviceUsage[displayName] = parseInt(count);
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