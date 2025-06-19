// src/routes/incomeRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/incomeController");

router.post("/topup-trigger", controller.handleTopupTrigger); // Call this from wallet-service after topup approval

module.exports = router;
