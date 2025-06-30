// src/utils/redisClient.js
const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

module.exports = redisClient;
