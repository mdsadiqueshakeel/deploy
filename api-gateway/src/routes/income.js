// src/routes/income.js
const express = require("express");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");

const INCOME_SERVICE_URL = process.env.INCOME_SERVICE_URL || "http://localhost:5004";

router.use(
  createProxyMiddleware({
    target: INCOME_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/income": "" },
  })
);

module.exports = router;
