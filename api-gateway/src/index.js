

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const referralRoutes = require("./routes/referral");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const walletRoutes = require("./routes/wallet"); // Ensure wallet routes are included
const incomeRoutes = require("./routes/income");
const purchaseRoutes = require("./routes/purchase"); // cleaner, more modular

const app = express();

// ✅ UPDATED CORS SETTINGS


app.use(
  cors({
    origin: process.env.CLIENT_URL, 
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
app.use("/api/income", incomeRoutes); // cleaner, more modular
app.use("/api/purchase", purchaseRoutes); // cleaner, more modular


// Global error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.API_GATEWAY_PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
