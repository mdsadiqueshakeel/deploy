

const dotenv = require("dotenv");
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const referralRoutes = require("./routes/referral");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const walletRoutes = require("./routes/wallet"); // Ensure wallet routes are included

const app = express();

// ✅ UPDATED CORS SETTINGS

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Access-Control-Allow-Origin']
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wallet", walletRoutes); // Ensure wallet routes are included

app.get("/ping", (req, res) => {
  console.log("PING HIT!");
  res.status(200).send("API Gateway is working 💥");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.API_GATEWAY_PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
