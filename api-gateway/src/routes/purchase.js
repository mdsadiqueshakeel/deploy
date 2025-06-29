const express = require("express");
const router = express.Router();
const axios = require("axios");
const walletAuth = require("../middlewares/walletAuth");

const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || "http://localhost:5003";

// -------------------------
// 🧾 USER ROUTES
// -------------------------

// 🛍️ Request product purchase
router.post("/products/request", walletAuth, async (req, res) => {
  try {
    const response = await axios.post(`${WALLET_SERVICE_URL}/products/request`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
        Cookie: req.headers.cookie,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Product request error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// 🧾 Get my purchase history
router.get("/products/my-purchases", walletAuth, async (req, res) => {
  try {
    const response = await axios.get(`${WALLET_SERVICE_URL}/products/my-purchases`, {
      headers: {
        Authorization: req.headers.authorization,
        Cookie: req.headers.cookie,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Get my purchases error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});


// -------------------------
// 👑 ADMIN ROUTES
// -------------------------

// Get all purchase requests
router.get("/products/admin", walletAuth, async (req, res) => {
  try {
    const response = await axios.get(`${WALLET_SERVICE_URL}/products/admin`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Get all purchases error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// ✅ Approve purchase request
router.patch("/products/admin/:purchaseId/approve", walletAuth, async (req, res) => {
  try {
    const response = await axios.patch(`${WALLET_SERVICE_URL}/products/admin/${req.params.purchaseId}/approve`, {}, {
      headers: {
        Authorization: req.headers.authorization,
        Cookie: req.headers.cookie,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Approve purchase error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// ❌ Reject purchase request
router.patch("/products/admin/:purchaseId/reject", walletAuth, async (req, res) => {
  try {
    const response = await axios.patch(`${WALLET_SERVICE_URL}/products/admin/${req.params.purchaseId}/reject`, {}, {
      headers: {
        Authorization: req.headers.authorization,
        Cookie: req.headers.cookie,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Reject purchase error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

module.exports = router;
