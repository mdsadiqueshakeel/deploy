const express = require("express");
const { approveTopupRequest, approveWithdrawRequest, creditIncome,getPendingRequestsSummary,getPendingTopupRequestsByUser, getPendingWithdrawRequestsByUser, declineTopupRequest, declineWithdrawRequest } = require("../controllers/adminWalletController");
const { extractUser, isAuthenticated, isAdmin } = require("../middlewares/auth.js");
const { cacheMiddleware } = require("../middlewares/cacheMiddleware.js");
const router = express.Router();

// Apply extractUser middleware to all routes
router.use(extractUser);

router.put("/topup-request/:id/approve", isAuthenticated, isAdmin, approveTopupRequest);
router.put("/withdraw-request/:id/approve", isAuthenticated, isAdmin, approveWithdrawRequest);
router.put("/topup-request/:id/decline", isAuthenticated, isAdmin, declineTopupRequest);
router.put("/withdraw-request/:id/decline", isAuthenticated, isAdmin, declineWithdrawRequest);
router.post("/credit-income", isAuthenticated, isAdmin, creditIncome);
router.get("/pending-requests", cacheMiddleware, getPendingRequestsSummary); // OK to cache
router.get("/user/:userId/pending-topup-requests", isAuthenticated, isAdmin, getPendingTopupRequestsByUser); // 🔥 REMOVE cacheMiddleware
router.get("/user/:userId/pending-withdraw-requests", isAuthenticated, isAdmin, getPendingWithdrawRequestsByUser); // 🔥 REMOVE cacheMiddleware

module.exports = router;
