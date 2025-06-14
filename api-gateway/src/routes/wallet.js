const express = require("express");
const router = express.Router();
const axios = require("axios");
const walletAuth = require("../middlewares/walletAuth");
 // same as used in /me route

const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || "http://localhost:5003";

// Logger
router.use((req, res, next) => {
  console.log(`[API Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

//
// 🧾 USER ROUTES
//

// Top-up Request
router.post("/user/topup-request", walletAuth, async (req, res) => {
  try {
    const response = await axios.post(`${WALLET_SERVICE_URL}/user/topup-request`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
        Cookie: req.headers.cookie,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Top-up error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// Withdraw Request
router.post("/user/withdraw-request", walletAuth, async (req, res) => {
  try {
    const response = await axios.post(`${WALLET_SERVICE_URL}/user/withdraw-request`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
        Cookie: req.headers.cookie,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Withdraw error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});


//
// 👑 ADMIN ROUTES
//

// Approve Top-up
router.put("/admin/topup-request/:id/approve", walletAuth, async (req, res) => {
  try {
    const response = await axios.put(
      `${WALLET_SERVICE_URL}/admin/topup-request/${req.params.id}/approve`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization,
          Cookie: req.headers.cookie,
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Top-up approval error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// Approve Withdraw
router.put("/admin/withdraw-request/:id/approve", walletAuth, async (req, res) => {
  try {
    const response = await axios.put(
      `${WALLET_SERVICE_URL}/admin/withdraw-request/${req.params.id}/approve`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization,
          Cookie: req.headers.cookie,
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Withdraw approval error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

module.exports = router;
