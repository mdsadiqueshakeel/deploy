// src/controllers/incomeController.js
const { calculateMatchingIncome } = require("../utils/calculateMatching");
const { calculateLevelIncome } = require("../utils/calculateLevel");

exports.handleTopupTrigger = async (req, res) => {
  const { userId, coins } = req.body;
  console.log("Request body:", req.body);

  try {
    await calculateMatchingIncome(userId, coins);
    await calculateLevelIncome(userId, coins);
    res.status(200).json({ message: "Income calculated successfully" });
    console.log("Request body:", req.body);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
