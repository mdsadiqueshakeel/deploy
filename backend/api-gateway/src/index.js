require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require('http-proxy-middleware');

const referralRoutes = require("./routes/referral");
const authRoutes = require("./routes/auth");
const businessRoutes = require("./routes/buisnessVolume");

const app = express();
// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());


// Import route proxies
app.use("/api/auth", authRoutes);
app.use("/api/referral", referralRoutes); 
app.use("/api/business", businessRoutes);

// // Proxy /business/* to business-volume-service
// app.use("/business", (req, res, next) => {
//   console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
//   next();
// });

// app.use(
//   "/business",
//   createProxyMiddleware({
//     target: process.env.BUSINESS_VOLUME_SERVICE_URL || "http://localhost:5002",
//     changeOrigin: true,
//     pathRewrite: {
//       '^/business': '', // Optional: removes /business if your backend expects just /add
//     },
//     onError(err, req, res) {
//       console.error("Proxy error:", err.message);
//       res.status(500).json({ error: "Proxy failed", details: err.message });
//     }
//   })
// );


app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.API_GATEWAY_PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
