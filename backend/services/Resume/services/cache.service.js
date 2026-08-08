// services/cache.service.js
import redis from "../../../shared/redis/redis.js";

const CACHE_TIME = 60 * 60;

export class CacheService {
  static async clearCaches(userId, cvId = null) {
    const keys = [`my-cvs:${userId}`, `cv:${userId}:*`];
    if (cvId) {
      keys.push(`cv-detail:${userId}:${cvId}`);
    }
    for (const key of keys) {
      await redis.del(key);
    }
  }

  static async get(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key, data, expireTime = CACHE_TIME) {
    await redis.set(key, JSON.stringify(data), "EX", expireTime);
  }

  static buildCacheKey(type, userId, id = null) {
    if (type === "my-cvs") return `my-cvs:${userId}`;
    if (type === "cv-detail") return `cv-detail:${userId}:${id}`;
    if (type === "cv") return `cv:${userId}:${id}`;
    return null;
  }
}