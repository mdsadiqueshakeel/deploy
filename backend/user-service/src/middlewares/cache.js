// middlewares/cache.js
const redis = require("../utils/redisClient");

exports.cacheMiddleware = async (req, res, next) => {
  // Extract userId from params or user object
  const userId = req.params.id || req.user?._id;
  if (!userId) return next(); // Don't cache for unauthenticated users

  const key = `cache:${req.originalUrl}`;

  const cached = await redis.get(key);
  if (cached) {
    console.log(`✅ Cache hit for ${key}`);
    return res.json(JSON.parse(cached));
  }

  // Override res.json to cache response
  res.sendResponse = res.json;
  res.json = async (body) => {
    // Store in Redis without expiration - will be cleared only when data changes
    await redis.set(key, JSON.stringify(body));
    console.log(`🧠 Redis SET: ${key}`);
    res.sendResponse(body);
  };

  next();
};
