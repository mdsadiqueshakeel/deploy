const express = require("express");
const { createTopupRequest, createWithdrawRequest } = require("../controllers/userWalletController");
const { extractUser, isAuthenticated } = require("../middlewares/auth");
const router = express.Router();
const Wallet = require("../models/Wallet");

// Apply extractUser middleware to all routes

router.get("/:id/wallet", async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.id });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json(wallet);
  } catch (err) {
    console.error("Wallet fetch failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.use(extractUser);

router.post("/withdraw-request", isAuthenticated, createWithdrawRequest);
router.post("/topup-request", isAuthenticated, createTopupRequest);
// GET /user/:id/wallet


module.exports = router;
