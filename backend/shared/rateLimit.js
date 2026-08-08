import redis from "./redis/redis.js";

export const uploadRateLimit = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || req.ip;

    const key = `rate-limit:${userId}`;

    const current = await redis.incr(key);

    
    if (current === 1) {
      await redis.expire(key, 15 * 60); 
    }

    // Limit exceeded
    if (current > 5) {
      const ttl = await redis.ttl(key);

      return res.status(429).json({
        success: false,
        message: `Too many requests. Try again after ${ttl} seconds.`,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    next(); 
  }
};