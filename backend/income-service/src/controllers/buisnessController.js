// File: backend/income-service/src/controllers/businessController.js

const { countSubtreeUsers } = require("../utils/treeCount");
const CarryForward = require("../models/CarryForward");
const TotalBusiness = require("../models/TotalBusiness");
const { getUserById } = require("../services/userService");
const { getWalletData } = require("../services/walletService");
const LevelLog = require("../models/LevelLog");
const MatchingLog = require("../models/MatchingLog");
const mongoose = require("mongoose");
const { Types } = mongoose;
const { clearBusinessCache } = require("../utils/clearCache"); // ✅ Add this at the top


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

exports.getBusinessReport = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = await getWalletData(userId);

    const totalLeftUsers = user.leftUser
      ? 1 + (await countSubtreeUsers(user.leftUser))
      : 0;

    const totalRightUsers = user.rightUser
      ? 1 + (await countSubtreeUsers(user.rightUser))
      : 0;

    const carry = await CarryForward.findOne({ userId });
    const totalLeftCarry = carry?.leftCarry || 0;
    const totalRightCarry = carry?.rightCarry || 0;

    let businessDoc = await TotalBusiness.findOne({ userId });

    // Create if missing
    if (!businessDoc) {
      businessDoc = await TotalBusiness.create({
        userId,
        totalTopup: 0,
        totalLeftUsers,
        totalRightUsers,
        totalLeftCarry,
        totalRightCarry,
      });
    }

    // ✅ Accumulate topupWallet to totalTopup
    businessDoc.totalTopup = wallet?.totalTopup || 0;
    await businessDoc.save();

    // Build level stats map
    const levelMap = {};
    (businessDoc?.levelStats || []).forEach((lvl) => {
      levelMap[lvl.level] = {
        level: lvl.level,
        teamCount: lvl.teamCount || 0,
        businessVolume: lvl.businessVolume || 0,
      };
    });

    (user.levelTree || []).forEach((lvl) => {
      if (!levelMap[lvl.level]) {
        levelMap[lvl.level] = {
          level: lvl.level,
          teamCount: lvl.users.length,
          businessVolume: 0,
        };
      } else {
        levelMap[lvl.level].teamCount = lvl.users.length;
      }
    });

    const levelStats = Object.values(levelMap)
      .map((lvl) => ({
        level: lvl.level,
        teamCount: lvl.teamCount || 0,
        businessVolume: lvl.businessVolume || 0,
        commissionEarned: parseFloat(
          (
            ((lvl.businessVolume || 0) *
              (LEVEL_COMMISSIONS[lvl.level] || 0)) /
            100
          ).toFixed(2)
        ),
      }))
      .sort((a, b) => a.level - b.level);

    const totalLevelIncome = await LevelLog.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$incomeEarned" } } },
    ]).then((res) => res[0]?.total || 0);

    const totalMatchingIncome = await MatchingLog.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$incomeEarned" } } },
    ]).then((res) => res[0]?.total || 0);

    const totalIncome = totalLevelIncome + totalMatchingIncome;
    const monthlyStats = businessDoc?.monthlyStats || [];
    
    // Don't clear cache on read operations
    // await clearBusinessCache(userId);

    res.json({
      userId,
      totalLeftUsers,
      totalRightUsers,
      totalLeftCarry,
      totalRightCarry,
      totalTopup: businessDoc.totalTopup,
      levelStats,
      totalMatchingIncome,
      totalLevelIncome,
      totalIncome,
      monthlyStats,
    });
  } catch (err) {
    console.error("❌ Business Report Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
