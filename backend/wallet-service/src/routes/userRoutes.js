const express = require("express");
const { createTopupRequest, createWithdrawRequest } = require("../controllers/userWalletController");
const { extractUser, isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// Apply extractUser middleware to all routes
router.use(extractUser);

router.post("/withdraw-request", isAuthenticated, createWithdrawRequest);
router.post("/topup-request", isAuthenticated, createTopupRequest);

module.exports = router;
