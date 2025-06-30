


const redis = require("./redisClient");

exports.clearWalletCache = async (userId) => {
  if (!userId) return;

  // Update to match the new cache key format
  const keys = [
    `cache:/user/${userId}/wallet`,
    `cache:/api/user/${userId}/wallet`,
    `cache:/internal/wallet/${userId}`,
    `cache:/user/topup/${userId}`,
    `cache:/api/user/topup/${userId}`,
    `cache:/user/withdraw/${userId}`,
    `cache:/api/user/withdraw/${userId}`,
    `cache:/admin/user/${userId}/pending-topup-requests`,
    `cache:/admin/user/${userId}/pending-withdraw-requests`,
    `cache:/admin/pending-requests`,
  ];

  await Promise.all(keys.map((key) => redis.del(key)));
  console.log(`🧹 Wallet cache cleared for ${userId}`);
};
