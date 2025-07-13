const { getUserById } = require("../services/userService");
const { getWalletData } = require("../services/walletService");
const { countSubtreeUsers } = require("./treeCount");
const CarryForward = require("../models/CarryForward");
const TotalBusiness = require("../models/TotalBusiness");
const LevelLog = require("../models/LevelLog");
const MatchingLog = require("../models/MatchingLog");
const mongoose = require("mongoose");
const { Types } = mongoose;

const LEVEL_COMMISSIONS = {
  1: 10,
  2: 4,
  3: 2,
  4: 1,
  5: 0.5,
};
for (let i = 6; i <= 10; i++) LEVEL_COMMISSIONS[i] = 0.5;
for (let i = 11; i <= 20; i++) LEVEL_COMMISSIONS[i] = 0.3;
for (let i = 21; i <= 30; i++) LEVEL_COMMISSIONS[i] = 0.2;

const sumTopupInSubtree = async (userId, cache = {}) => {
  if (!userId) return 0;
  if (cache[userId] !== undefined) return cache[userId];

  const user = await getUserById(userId);
  if (!user) return 0;

  const wallet = await getWalletData(userId);
  const selfTopup = Number(wallet?.totalTopup || 0);

  const left = user.leftUser ? await sumTopupInSubtree(user.leftUser, cache) : 0;
  const right = user.rightUser ? await sumTopupInSubtree(user.rightUser, cache) : 0;

  const total = selfTopup + left + right;
  cache[userId] = total;
  return total;
};

const updateTotalBusiness = async (userId) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return;
    }

    const wallet = await getWalletData(userId);
    const userCountCache = {};
    const topupCache = {};

    const totalLeftUsers = user.leftUser ? await countSubtreeUsers(user.leftUser, userCountCache) : 0;
    const totalRightUsers = user.rightUser ? await countSubtreeUsers(user.rightUser, userCountCache) : 0;
    const totalLeftCarry = user.leftUser ? await sumTopupInSubtree(user.leftUser, topupCache) : 0;
    const totalRightCarry = user.rightUser ? await sumTopupInSubtree(user.rightUser, topupCache) : 0;

    console.log(`📊 Tree stats for ${userId}: Left users: ${totalLeftUsers}, Right users: ${totalRightUsers}`);
    console.log(`💰 Carry: Left: ${totalLeftCarry}, Right: ${totalRightCarry}`);

    let businessDoc = await TotalBusiness.findOne({ userId });
    if (!businessDoc) {
      businessDoc = await TotalBusiness.create({
        userId,
        totalTopup: wallet?.totalTopup || 0,
        totalLeftUsers,
        totalRightUsers,
        totalLeftCarry,
        totalRightCarry,
        levelStats: [],
        monthlyStats: [],
      });
    } else {
      businessDoc.totalTopup = wallet?.totalTopup || 0;
      businessDoc.totalLeftUsers = totalLeftUsers;
      businessDoc.totalRightUsers = totalRightUsers;
      businessDoc.totalLeftCarry = totalLeftCarry;
      businessDoc.totalRightCarry = totalRightCarry;
    }

    // 💡 Rebuild levelStats fresh from levelTree
    const rawLevelStats = (user.levelTree || []).map((lvl) => {
      const level = Number(lvl.level);
      const userIds = lvl.users || [];
      return {
        level,
        teamCount: userIds.length,
        userIds,
      };
    });

    // 🧠 Calculate business volume per level using wallet.topup
    const resolvedLevelStats = await Promise.all(
      rawLevelStats.map(async (lvl) => {
        const volumeSum = await Promise.all(
          lvl.userIds.map(async (uid) => {
            const wallet = await getWalletData(uid);
            return Number(wallet?.totalTopup || 0);
          })
        );

        const businessVolume = volumeSum.reduce((acc, val) => acc + val, 0);
        const commission = LEVEL_COMMISSIONS[lvl.level] ?? 0;
        const commissionEarned = parseFloat(((businessVolume * commission) / 100).toFixed(2));

        return {
          level: lvl.level,
          teamCount: lvl.teamCount,
          businessVolume,
          commissionEarned,
        };
      })
    );

    businessDoc.levelStats = resolvedLevelStats.sort((a, b) => a.level - b.level);

    // 🧮 Income Aggregates
    const levelIncome = await LevelLog.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$incomeEarned" } } },
    ]).then((res) => res[0]?.total || 0);

const matchingIncome = await MatchingLog.aggregate([
  {
    $match: {
      userId: new Types.ObjectId(userId),
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$incomeEarned" },
    },
  },
])
  .then((res) => {
    const income = res[0]?.total || 0;
    console.log(`🔍 Matching income for ${userId}: ₹${income}`);
    return income;
  })
  .catch((err) => {
    console.error("❌ MatchingLog aggregation failed:", err);
    return 0;
  });


    businessDoc.totalLevelIncome = levelIncome;
    businessDoc.totalMatchingIncome = matchingIncome;
    businessDoc.totalIncome = levelIncome + matchingIncome;

    businessDoc.monthlyStats = businessDoc.monthlyStats || [];

    await businessDoc.save();
    console.log(`✅ Total business updated for ${userId}`);
  } catch (err) {
    console.error("❌ updateTotalBusiness Error:", err.message);
  }
};

module.exports = { updateTotalBusiness };
