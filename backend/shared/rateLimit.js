import redis from "./redis/redis.js";


export const uploadRateLimit = async (req, res, next) => {
  try {
    // Logged-in user ke liye x-user-id,
    // warna IP address use hoga
    const userId = req.headers["x-user-id"] || req.ip;

    const key = `rate-limit:${userId}`;

    // Request count increase
    const current = await redis.incr(key);

    // First request par 1 hour ka timer start
    if (current === 1) {
      await redis.expire(key, 60 * 60);
    }

    // 80 requests per hour allowed
    if (current > 80) {
      const ttl = await redis.ttl(key);

      return res.status(429).json({
        success: false,
        message: `Too many requests. Try again after ${ttl} seconds.`,
        retryAfter: ttl,
      });
    }

    // Request allowed
    next();
  } catch (error) {
    console.error("Rate Limit Error:", error);

    
    next();
  }
};