const axios = require("axios");
const TopupRequest = require("../models/TopupRequest");
const WithdrawRequest = require("../models/WithdrawRequest");
const Wallet = require("../models/Wallet");
const INCOME_SERVICE_URL = process.env.INCOME_SERVICE_URL || "http://localhost:5004";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001";

exports.approveTopupRequest = async (req, res) => {
  const { id } = req.params;

  const request = await TopupRequest.findById(id);
  if (!request || request.status !== "pending") {
    return res.status(400).json({ message: "Invalid request" });
  }

  // ✅ mark request as approved
  request.status = "approved";
  await request.save();

  // ✅ update topupWallet
  let wallet = await Wallet.findOne({ userId: request.userId });
  if (!wallet) wallet = await Wallet.create({ userId: request.userId });

  wallet.topupWallet += request.amount;
  await wallet.save();

  // ✅ trigger income-service!
  try {
    await axios.put(
      `${USER_SERVICE_URL}/activate-user/${request.userId}`
    );
    // ✅ Mark user as active after top-up
    await axios.post(`${INCOME_SERVICE_URL}/api/income/topup-trigger`, {
      userId: request.userId,
      coins: request.amount, // coins = topup
    });
  } catch (err) {
    console.error("Failed to trigger income-service:", err.message);
  }

  res.json({ message: "Top-up request approved", wallet });
};

exports.approveWithdrawRequest = async (req, res) => {
  const { id } = req.params;

  const request = await WithdrawRequest.findById(id);
  if (!request || request.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Invalid or already processed request" });
  }

  const wallet = await Wallet.findOne({ userId: request.userId });
  if (!wallet || wallet.incomeWallet < request.amount) {
    return res.status(400).json({ message: "User has insufficient funds" });
  }

  wallet.incomeWallet -= request.amount;
  await wallet.save();

  request.status = "approved";
  await request.save();

  res.json({ message: "Withdraw request approved", wallet });
};

exports.creditIncome = async (req, res) => {
  const { userId, amount, type } = req.body;

  if (!userId || !amount)
    return res.status(400).json({ message: "userId and amount are required" });

  const incomeAmount = amount * 0.9;
  const shoppingAmount = amount * 0.1;

  // ⚙️ Update wallets (example schema names)
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

  // Optional: Save log if needed
  await WalletLog.create({
    userId,
    amount,
    type: type || "income",
    creditedBy: "system", // or adminId if manual
    comment: "System credited income",
  });

  res.status(200).json({ message: "Income credited successfully" });
};
