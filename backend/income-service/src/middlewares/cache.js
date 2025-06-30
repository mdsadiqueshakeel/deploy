// middlewares/cache.js
const redis = require("../utils/redisClient");

exports.cacheMiddleware = async (req, res, next) => {
  const userId = req.params.userId || req.user?._id;
  if (!userId) return next();

  const key = `cache:${req.originalUrl}`;

  const cached = await redis.get(key);
  if (cached) {
    console.log(`✅ Redis HIT: ${key}`);
    return res.json(JSON.parse(cached));
  }

  const originalJson = res.json.bind(res);

  // 🔒 Hold response body to cache it later
  let responseBody;
  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  // ✅ Listen when response is done being sent
  res.once("finish", async () => {
    try {
      if (responseBody) {
        // Store in Redis without expiration - will be cleared only when data changes
        await redis.set(key, JSON.stringify(responseBody));
        console.log(`🧠 Redis SET: ${key}`);
      }
    } catch (err) {
      console.error("⚠️ Redis cache set failed:", err.message);
    }
  });

  next();
};
