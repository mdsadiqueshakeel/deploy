// ✅ income-service/src/utils/calculateMatching.js
const MatchingLog = require("../models/MatchingLog.js");
const CarryForward = require("../models/CarryForward.js");
const { getUserById } = require("../services/userService");
const { creditToWallet } = require("../services/walletService");
const TotalBusiness = require("../models/TotalBusiness.js");
const { updateMonthlyStats } = require("./monthTracker.js");


const updateMatchingBusiness = async (userId, side, coins) => {
  try {
    if (!["left", "right"].includes(side)) return;

    const update = {};
    update[`${side}Business`] = coins;

    await TotalBusiness.findOneAndUpdate(
      { userId },
      { $inc: update },
      { new: true, upsert: true }
    );
  } catch (err) {
    console.error("❌ updateMatchingBusiness error:", err.message);
  }
};

const calculateMatchingIncome = async (userId, coins) => {
  console.log("📈 Calculating Matching Income for:", userId);
  const user = await getUserById(userId);
  if (!user || !user.parentId) {
    console.warn("⛔ No parent found for user:", userId);
    return;
  }

  let current;
  let from = userId;
  let parentId = user.parentId;

  while (parentId) {
    try {
      current = await getUserById(parentId);
      console.log("✅ Parent Fetched:", current.name);
      if (!current) {
        console.warn("❌ Parent user not found:", parentId);
        break;
      }
      console.log(`➡️ Moving up from ${from} to parent ${parentId}`);

      const isLeft = String(current.leftUser) === String(from);
      const side = isLeft ? "leftCarry" : "rightCarry";

      // Fetch or create carry doc
      let carry = await CarryForward.findOne({ userId: current._id });
      if (!carry) {
        carry = await CarryForward.create({ userId: current._id });
      }

      carry[side] = (carry[side] || 0) + coins;

      const leftBV = carry.leftCarry || 0;
      const rightBV = carry.rightCarry || 0;
      const matched = Math.min(leftBV, rightBV);

      if (matched > 0) {
        const income = matched * 0.05;
        await creditToWallet(current._id, income);
        await updateMatchingBusiness(current._id, isLeft ? "left" : "right", coins);
        await updateMonthlyStats(current._id, income);

        await MatchingLog.create({
          userId: current._id,
          matchedAmount: matched,
          incomeEarned: income,
          matchBreakdown: { left: leftBV, right: rightBV },
        });

        carry.leftCarry = leftBV - matched;
        carry.rightCarry = rightBV - matched;
      }

      await carry.save();

      // Move up the tree
      from = current._id;
      parentId = current.parentId;

    } catch (err) {
      console.error("💥 Error in matching income loop:", err.message);
      console.error("❌ Failed to fetch parent:", parentId);
      console.error("🔎 Reason:", err.response?.data || err.message);
      break;
    }
  }
};

module.exports = { calculateMatchingIncome };
