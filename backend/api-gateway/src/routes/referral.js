const express = require("express");
const router = express.Router();
const axios = require("axios");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001";

// Proxy GET /referral/validate/:referralCode
router.get("/validate/:referralCode", async (req, res) => {
  try {
    const { referralCode } = req.params;
    const response = await axios.get(`${USER_SERVICE_URL}/api/referral/validate/${referralCode}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

module.exports = router;
