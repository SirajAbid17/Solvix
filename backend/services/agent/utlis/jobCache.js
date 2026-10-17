
import redis from "../../../shared/redis/redis.js";

const CACHE_PREFIX = "job-search";
const COOLDOWN_HOURS = 24;
const COOLDOWN_SECONDS = COOLDOWN_HOURS * 60 * 60;


export const canUserSearchJobs = async (userId) => {
  try {
    const key = `${CACHE_PREFIX}:cooldown:${userId}`;
    const ttl = await redis.ttl(key);

    if (ttl > 0) {
      return {
        allowed: false,
        remainingSeconds: ttl,
        nextAvailableAt: new Date(Date.now() + ttl * 1000),
      };
    }

    return {
      allowed: true,
      remainingSeconds: 0,
      nextAvailableAt: null,
    };
  } catch (error) {
    console.error("canUserSearchJobs error:", error.message);
   
    return { allowed: true, remainingSeconds: 0, nextAvailableAt: null };
  }
};


export const setSearchCooldown = async (userId) => {
  try {
    const key = `${CACHE_PREFIX}:cooldown:${userId}`;
    await redis.set(key, "1", "EX", COOLDOWN_SECONDS);
    return true;
  } catch (error) {
    console.error("setSearchCooldown error:", error.message);
    return false;
  }
};


export const cacheJobResults = async (userId, query, jobs) => {
  try {
    const key = `${CACHE_PREFIX}:results:${userId}`;
    await redis.set(
      key,
      JSON.stringify({ query, jobs, cachedAt: new Date().toISOString() }),
      "EX",
      COOLDOWN_SECONDS
    );
    return true;
  } catch (error) {
    console.error("cacheJobResults error:", error.message);
    return false;
  }
};


export const getCachedJobResults = async (userId) => {
  try {
    const key = `${CACHE_PREFIX}:results:${userId}`;
    const data = await redis.get(key);

    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error("getCachedJobResults error:", error.message);
    return null;
  }
};


export const formatRemainingTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};