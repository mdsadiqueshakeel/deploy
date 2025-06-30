// src/routes/incomeRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/incomeController");
const { cacheMiddleware } = require("../middlewares/cache");

router.post("/topup-trigger", cacheMiddleware, controller.handleTopupTrigger); // Call this from wallet-service after topup approval

module.exports = router;
