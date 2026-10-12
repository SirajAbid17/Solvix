import redis from "./redis/redis.js";


export const uploadRateLimit = async (req, res, next) => {
  try {
    
    const userId = req.headers["x-user-id"] || req.ip;

    const key = `rate-limit:${userId}`;

    
    const current = await redis.incr(key);

    
    if (current === 1) {
      await redis.expire(key, 60 * 60);
    }

   
    if (current > 80) {
      const ttl = await redis.ttl(key);

      return res.status(429).json({
        success: false,
        message: `Too many requests. Try again after ${ttl} seconds.`,
        retryAfter: ttl,
      });
    }

   
    next();
  } catch (error) {
    console.error("Rate Limit Error:", error);

    
    next();
  }
};