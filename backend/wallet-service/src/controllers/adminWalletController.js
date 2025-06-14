const TopupRequest = require("../models/TopupRequest");
const Wallet = require("../models/Wallet");
const WithdrawRequest = require("../models/WithdrawRequest");

exports.approveTopupRequest = async (req, res) => {
  const { id } = req.params;

  const request = await TopupRequest.findById(id);
  if (!request || request.status !== "pending") {
    return res.status(400).json({ message: "Invalid request" });
  }

  // mark as approved
  request.status = "approved";
  await request.save();

  // update user's wallet
  let wallet = await Wallet.findOne({ userId: request.userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId: request.userId });
  }

  wallet.topupWallet += request.amount;
  await wallet.save();

  res.json({ message: "Top-up request approved", wallet });
};


exports.approveWithdrawRequest = async (req, res) => {
  const { id } = req.params;

  const request = await WithdrawRequest.findById(id);
  if (!request || request.status !== "pending") {
    return res.status(400).json({ message: "Invalid or already processed request" });
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

