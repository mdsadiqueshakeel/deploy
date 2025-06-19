const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet");
const WalletLog = require("../models/WalletLog");

// Unprotected internal call from income-service
router.post("/internal/credit-income", async (req, res) => {
  const { userId, amount, type } = req.body;

  if (!userId || !amount)
    return res.status(400).json({ message: "userId and amount required" });

  const incomeAmount = amount * 0.9;
  const shoppingAmount = amount * 0.1;

  await Wallet.findOneAndUpdate(
    { userId },
    {
      $inc: {
        incomeWallet: incomeAmount,
        shoppingWallet: shoppingAmount,
      },
    },
    { new: true, upsert: true }
  );

  await WalletLog.create({
    userId,
    amount,
    type: type || "income",
    creditedBy: "system",
    comment: "Credited by income-service",
  });

  res.status(200).json({ message: "Credited successfully" });
});

module.exports = router;
