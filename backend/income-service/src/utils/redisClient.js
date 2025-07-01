// src/utils/redisClient.js
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Redis connected (income-service)");
});

redis.on("error", (err) => {
  console.error("❌ Redis error (income-service):", err);
});

module.exports = redis;
