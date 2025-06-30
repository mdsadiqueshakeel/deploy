const redis = require('./redisClient.js');

exports.clearUserCache = async (userId) => {
  if (!userId) return;
  
  // Fix the variable name error (id -> userId)
  await redis.del(`cache:/api/auth/me`);
  await redis.del(`cache:/api/admin/users`);
  await redis.del(`cache:/api/user/${userId}`);
  await redis.del(`cache:/internal/user/${userId}`);
  
  console.log(`🧹 User cache cleared for ${userId}`);
};
