// src/utils/clearAdminCache.js
const redis = require('./redisClient.js');

// Utility to delete all matching keys
const deleteMatchingKeys = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(`🧹 Cleared cache for pattern: ${pattern}`);
  } else {
    console.log(`⚠️ No cache found for pattern: ${pattern}`);
  }
};

exports.clearAdminCache = async (userId) => {
  if (!userId) return;
  
  try {
    // Static routes (not user-specific)
    await deleteMatchingKeys(`cache:/api/admin/users*`);
    await deleteMatchingKeys(`cache:/api/admin/dashboard*`);

    // Dynamic route (user-specific)
    await deleteMatchingKeys(`cache:/api/admin/user/${userId}*`);

    console.log(`✅ Cleared admin-related cache for userId: ${userId}`);
  } catch (err) {
    console.error("❌ Error clearing admin cache:", err.message);
  }
};
