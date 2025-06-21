// income-service/utils/monthTracker.js
const TotalBusiness = require("../models/TotalBusiness");

const updateMonthlyStats = async (userId, income) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // e.g. "2025-06"

  const doc = await TotalBusiness.findOne({ userId });
  if (!doc) return;

  const index = doc.monthlyStats.findIndex((stat) => stat.month === currentMonth);

  if (index !== -1) {
    doc.monthlyStats[index].income += income;
  } else {
    doc.monthlyStats.push({
      month: currentMonth,
      income: income,
    });
  }

  doc.totalIncome += income; // optional: keep syncing totalIncome
  await doc.save();
};

module.exports = { updateMonthlyStats };
