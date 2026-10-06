import redis from "./redis/redis.js";

export const authRateLimit = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || req.ip;

    const key = `auth-rate-limit:${userId}`;

    // Request count increase
    const current = await redis.incr(key);

    // 15 minutes ka window
    if (current === 1) {
      await redis.expire(key, 15 * 60);
    }

    // 10 authentication attempts / 15 minutes
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

    // Redis fail ho to request block nahi hogi
    next();
  }
};