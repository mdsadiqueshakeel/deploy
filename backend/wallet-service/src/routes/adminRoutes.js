const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { approveTopupRequest, approveWithdrawRequest, creditIncome,getPendingRequestsSummary,getPendingTopupRequestsByUser, getPendingWithdrawRequestsByUser, declineTopupRequest, declineWithdrawRequest } = require("../controllers/adminWalletController");
const { extractUser, isAuthenticated, isAdmin } = require("../middlewares/auth.js");
const { cacheMiddleware } = require("../middlewares/cacheMiddleware.js");
const router = express.Router();
const axios = require("axios");
const INCOME_SERVICE_URL = process.env.INCOME_SERVICE_URL;

// Apply extractUser middleware to all routes
router.use(extractUser);

router.put("/topup-request/:id/approve", isAuthenticated, isAdmin, approveTopupRequest);
router.put("/withdraw-request/:id/approve", isAuthenticated, isAdmin, approveWithdrawRequest);
router.put("/topup-request/:id/decline", isAuthenticated, isAdmin, declineTopupRequest);
router.put("/withdraw-request/:id/decline", isAuthenticated, isAdmin, declineWithdrawRequest);
router.post("/credit-income", isAuthenticated, isAdmin, creditIncome);
router.get("/pending-requests", cacheMiddleware, getPendingRequestsSummary); // OK to cache

// Test route to verify income service connectivity
router.get("/test-income-service", async (req, res) => {
  try {
    console.log("🧪 Testing income service connectivity");
    
    const baseUrl = INCOME_SERVICE_URL.startsWith('http') ? INCOME_SERVICE_URL : `http://${INCOME_SERVICE_URL}`;
    console.log(`🧪 INCOME_SERVICE_URL env value: ${INCOME_SERVICE_URL}`);
    console.log(`🧪 Constructed base URL: ${baseUrl}`);
    
    // Try to ping the income service
    const pingUrl = `${baseUrl}/ping`;
    console.log(`🧪 Pinging income service at: ${pingUrl}`);
    
    const pingResponse = await axios.get(pingUrl);
    console.log(`🧪 Ping response:`, pingResponse.data);
    
    res.json({
      success: true,
      message: "Income service connectivity test successful",
      pingResponse: pingResponse.data,
      incomeServiceUrl: baseUrl
    });
  } catch (error) {
    console.error("🧪 Income service connectivity test failed:", error.message);
    console.error("🧪 Error details:", error.response?.data || "No response data");
    
    res.status(500).json({
      success: false,
      message: "Income service connectivity test failed",
      error: error.message,
      errorDetails: error.response?.data || "No response data",
      incomeServiceUrl: INCOME_SERVICE_URL
    });
  }
});
router.get("/user/:userId/pending-topup-requests", isAuthenticated, isAdmin, cacheMiddleware, getPendingTopupRequestsByUser);
router.get("/user/:userId/pending-withdraw-requests", isAuthenticated, isAdmin, cacheMiddleware, getPendingWithdrawRequestsByUser);

module.exports = router;
