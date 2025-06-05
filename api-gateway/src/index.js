require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const referralRoutes = require("./routes/referral");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.API_GATEWAY_PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));