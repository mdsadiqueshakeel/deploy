const WithdrawRequest = require("../models/WithdrawRequest");
const TopupRequest = require("../models/TopupRequest");
const Wallet = require("../models/Wallet");

exports.createTopupRequest = async (req, res) => {
  const { amount, note } = req.body;
  const userId = req.user._id; // comes from auth middleware

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const request = await TopupRequest.create({
    userId,
    amount,
    note,
  });

  res.status(201).json({ message: "Top-up request created", request });
};


exports.createWithdrawRequest = async (req, res) => {
  try {
    const { amount, note } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.incomeWallet < amount) {
      return res.status(400).json({ message: "Insufficient income wallet balance" });
    }

    const request = await WithdrawRequest.create({
      userId,
      amount,
      note,
    });

    res.status(201).json({ message: "Withdraw request submitted", request });
  } catch (error) {
    console.error("Withdraw request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserTopupRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await TopupRequest.find({ userId: id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Failed to fetch user's top-up requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧾 Get wallet details for userId
exports.getWalletByUserId = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });

    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    res.json({
      topupWallet: wallet.topupWallet,
      incomeWallet: wallet.incomeWallet,
      shoppingWallet: wallet.shoppingWallet,
    });
  } catch (error) {
    console.error("Wallet fetch failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
