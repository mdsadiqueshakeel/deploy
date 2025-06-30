// src/utils/redisClient.js
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  // enable this if you want to see logs
  // lazyConnect: true 
});

redis.on('connect', () => {
  console.log('✅ Redis connected (admin-service)');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error (admin-service):', err);
});

module.exports = redis;
