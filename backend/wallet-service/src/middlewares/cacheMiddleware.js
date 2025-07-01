const redis = require("../utils/redisClient");

exports.cacheMiddleware = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user?._id || req.admin?.adminId || "public";
    const key = `cache:${req.originalUrl}:${userId}`; // 🔥 Add identity to the cache key
    
    // Debug log to see the exact cache key format
    console.log(`🔑 Cache key format: ${key}`);

    const cached = await redis.get(key);
    if (cached) {
      console.log(`✅ Redis HIT: ${key}`);
      return res.json(JSON.parse(cached));
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      await redis.set(key, JSON.stringify(body));
      console.log(`🧠 Redis SET: ${key}`);
      res.sendResponse(body);
    };

    next();
  } catch (err) {
    console.error("❌ Redis cache middleware error:", err.message);
    next(); // Don't break the route if cache fails
  }
};
