const express = require("express");
const { approveTopupRequest, approveWithdrawRequest, creditIncome, getAllTopupRequests } = require("../controllers/adminWalletController");
const { extractUser, isAuthenticated, isAdmin } = require("../middlewares/auth.js");
const router = express.Router();

// Apply extractUser middleware to all routes
router.use(extractUser);

router.put("/topup-request/:id/approve", isAuthenticated, isAdmin, approveTopupRequest);
router.put("/withdraw-request/:id/approve", isAuthenticated, isAdmin, approveWithdrawRequest);
router.post("/credit-income", isAuthenticated, isAdmin, creditIncome);
router.get("/topup-requests", isAuthenticated, isAdmin, getAllTopupRequests);

module.exports = router;
