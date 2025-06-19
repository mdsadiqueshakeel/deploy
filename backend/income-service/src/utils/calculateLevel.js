// ✅ income-service/src/utils/calculateLevel.js
const LevelLog = require("../models/LevelLog.js");
const TotalBusiness = require("../models/TotalBusiness.js");
const { getUserById } = require("../services/userService");
const { creditToWallet } = require("../services/walletService");

const updateTotalBusiness = async (userId, incomeAmount) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  const record = await TotalBusiness.findOne({ userId });

  if (!record) {
    await TotalBusiness.create({
      userId,
      totalIncome: incomeAmount,
      monthlyStats: [{ month: currentMonth, income: incomeAmount }],
    });
    return;
  }

  record.totalIncome += incomeAmount;

  const monthIndex = record.monthlyStats.findIndex((m) => m.month === currentMonth);
  if (monthIndex !== -1) {
    record.monthlyStats[monthIndex].income += incomeAmount;
  } else {
    record.monthlyStats.push({ month: currentMonth, income: incomeAmount });
  }

  await record.save();
};

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

const calculateLevelIncome = async (userId, coins) => {
  const user = await getUserById(userId);
  if (!user || !user.referredBy) return;

  let current = await getUserById(user.referredBy);
  let level = 1;

  while (current && level <= 30) {
    const percentage = LEVEL_COMMISSIONS[level] || 0;

    if (percentage > 0) {
      const income = (coins * percentage) / 100;

      await creditToWallet(current._id, income);

      // optional: create income log
      await LevelLog.create({
        userId: current._id,
        levelFrom: level,
        sourceUserId: userId,
        topupAmount: coins,
        incomeEarned: income,
      });

      console.log(`💸 Level ${level} | ${income} to ${current.name} (${current._id})`);
    }

    if (!current.referredBy) break;
    current = await getUserById(current.referredBy);
    level++;
  }
};

module.exports = { calculateLevelIncome };
