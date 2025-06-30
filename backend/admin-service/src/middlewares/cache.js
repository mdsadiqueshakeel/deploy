const redis = require("../utils/redisClient");

exports.cacheMiddleware = async (req, res, next) => {
  // Extract userId from params or user object
  const userId = req.params.userId || req.user?._id || "public";
  const key = `cache:${req.originalUrl}`;
  
  const cached = await redis.get(key);
  if (cached) {
    console.log(`✅ Redis HIT: ${key}`);
    return res.json(JSON.parse(cached));
  }

  res.sendResponse = res.json;
  res.json = async (body) => {
    // Store in Redis without expiration - will be cleared only when data changes
    await redis.set(key, JSON.stringify(body));
    console.log(`🧠 Redis SET: ${key}`);
    res.sendResponse(body);
  };

  next();
};
