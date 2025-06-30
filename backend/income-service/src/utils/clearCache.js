// utils/clearBusinessCache.js
const redis = require("./redisClient");

exports.clearBusinessCache = async (userId) => {
  if (!userId) return;
  
  // Update to match the new cache key format
  await redis.del(`cache:/business/${userId}`);
  await redis.del(`cache:/api/income/business/${userId}`);
  
  console.log(`🧹 Cleared business report cache for user ${userId}`);
};
