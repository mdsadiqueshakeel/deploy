// src/utils/redisClient.js
const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error (user-service):", err);
});

module.exports = redisClient;
