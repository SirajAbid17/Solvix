
import Redis from "ioredis";

const url = process.env.REDIS_URL;
const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT) || 6379;

if (!url && !host) {
  throw new Error(
    "Redis config missing: set REDIS_URL or REDIS_HOST (and REDIS_PORT)"
  );
}

const options = {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 200, 3000),
};

const redis = url ? new Redis(url, options) : new Redis({ host, port, ...options });

redis.on("connect", () => console.log("[redis] connected"));
redis.on("error", (err) => console.error("[redis] error:", err.message));

export default redis;