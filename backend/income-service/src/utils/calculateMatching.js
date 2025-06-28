const STATUS_TIERS = require("../constants/statusTier");
const CarryForward = require("../models/CarryForward");
const { getUserById } = require("../services/userService");
const { creditToWallet } = require("../services/walletService");
const TotalBusiness = require("../models/TotalBusiness");
const { updateMonthlyStats } = require("./monthTracker");
const MatchingLog = require("../models/MatchingLog");

const getDailyMatchingCapByStatus = (status) => {
  const tier = STATUS_TIERS.find(t => t.name === status);
  return tier?.dailyMatchingCap || 0;
};

const resetMatchedTodayIfNewDay = (carryDoc) => {
  const today = new Date().toISOString().split('T')[0];
  const lastReset = carryDoc.lastReset?.toISOString().split('T')[0];

  if (today !== lastReset) {
    console.log(`🕛 New day detected! Resetting matchedToday for user ${carryDoc.userId}`);
    carryDoc.matchedToday = 0;
    carryDoc.lastReset = new Date();
  }

  return carryDoc;
};

const updateMatchingBusiness = async (userId, side, coins) => {
  const update = {};
  update[side === "leftCarry" ? "totalLeftCarry" : "totalRightCarry"] = coins;

  await TotalBusiness.findOneAndUpdate(
    { userId },
    { $inc: update },
    { upsert: true }
  );
};

const calculateMatchingIncome = async (userId, coins) => {
  console.log(`🚀 Starting Matching Income Calculation for Triggered User: ${userId} | Coins: ${coins}`);
  
  const user = await getUserById(userId);
  if (!user || !user.parentId) {
    console.log(`❌ No parent found or invalid user.`);
    return;
  }

  let from = userId;
  let parentId = user.parentId;

  while (parentId) {
    const parent = await getUserById(parentId);
    if (!parent) {
      console.log(`❌ Parent not found for ID: ${parentId}`);
      break;
    }

    console.log(`\n🔼 Moving from ${from} 👉 Parent: ${parent.name} (${parent._id}) | Status: ${parent.status}`);

    const isLeft = String(parent.leftUser) === String(from);
    const side = isLeft ? "leftCarry" : "rightCarry";
    console.log(`📍 Business side for ${parent.name}: ${side === "leftCarry" ? "Left" : "Right"}`);

    let carry = await CarryForward.findOne({ userId: parent._id }) || new CarryForward({ userId: parent._id });

    // 🕛 Check if new day
    carry = resetMatchedTodayIfNewDay(carry);

    // 💰 Add coins to carry
    carry[side] += coins;
    console.log(`➕ Added ${coins} to ${side} | Updated BV: Left=${carry.leftCarry}, Right=${carry.rightCarry}`);

    const leftBV = carry.leftCarry;
    const rightBV = carry.rightCarry;
    const matchableBV = Math.min(leftBV, rightBV);

    if (matchableBV > 0) {
      const cap = getDailyMatchingCapByStatus(parent.status);
      const remainingCap = cap - carry.matchedToday;

      console.log(`🧮 Matching Check | Matchable: ${matchableBV}, Daily Cap: ${cap}, Used: ${carry.matchedToday}, Left: ${remainingCap}`);

      if (remainingCap > 0) {
        const matchedBV = Math.min(matchableBV, remainingCap);
        const income = matchedBV * 0.05;

        console.log(`💸 MATCHING | ${matchedBV} BV matched -> ₹${income} credited to ${parent.name}`);

        // Credit income
        await creditToWallet(parent._id, income);
        await updateMonthlyStats(parent._id, income);

        // Create log
        await MatchingLog.create({
          userId: parent._id,
          matchedAmount: matchedBV,
          incomeEarned: income,
          matchBreakdown: { left: leftBV, right: rightBV }
        });

        // Deduct matched from both sides
        carry.leftCarry = leftBV - matchedBV;
        carry.rightCarry = rightBV - matchedBV;

        // Update matchedToday
        carry.matchedToday += matchedBV;

        // Update TotalBusiness for rank/rewards
        await updateMatchingBusiness(parent._id, "leftCarry", matchedBV);
        await updateMatchingBusiness(parent._id, "rightCarry", matchedBV);
      } else {
        console.log(`⛔ ${parent.name} has reached the daily cap for matching income. No income credited.`);
      }
    } else {
      console.log(`⚠️ No matchable BV found for ${parent.name}`);
    }

    await carry.save();

    // Move up
    from = parent._id;
    parentId = parent.parentId;
  }

  console.log(`✅ Matching income calculation completed for triggered user ${userId}\n`);
};

module.exports = { calculateMatchingIncome };
