import redis from "./redis/redis.js";

export const authRateLimit = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || req.ip;

    const key = `auth-rate-limit:${userId}`;

    
    const current = await redis.incr(key);

   
    if (current === 1) {
      await redis.expire(key, 15 * 60);
    }

    
    if (current > 10) {
      const ttl = await redis.ttl(key);

      return res.status(429).json({
        success: false,
        message: `Too many authentication attempts. Try again after ${ttl} seconds.`,
        retryAfter: ttl,
      });
    }

    next();
  } catch (error) {
    console.error("Auth Rate Limit Error:", error);

   
    next();
  }
};