const express = require("express");
const router = express.Router();
const axios = require("axios");

const BUSINESS_VOLUME_SERVICE_URL = process.env.BUSINESS_VOLUME_SERVICE_URL || "http://localhost:5002";

router.post("/business/add", async (req, res) => {
    try {
      const response = await axios.post(`${BUSINESS_VOLUME_SERVICE_URL}/business/add`, req.body);
      res.status(response.status).json(response.data);
    } catch (err) {
      res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
    }
  });

// GET /api/business/:userId -> GET business-volume-service /business/:userId
router.get("/:userId", async (req, res) => {
  try {
    const response = await axios.get(`${BUSINESS_VOLUME_SERVICE_URL}/business/${req.params.userId}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

module.exports = router;
  