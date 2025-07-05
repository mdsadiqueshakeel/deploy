const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const referralRoutes = require("./routes/referral");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const walletRoutes = require("./routes/wallet");
const incomeRoutes = require("./routes/income");
const purchaseRoutes = require("./routes/purchase");

const app = express();


// ✅✅ REDIRECT from www to non-www + force HTTPS
app.use((req, res, next) => {
  const host = req.headers.host;
  const proto = req.headers["x-forwarded-proto"];

  // Force HTTPS
  if (proto !== "https") {
    return res.redirect(301, `https://${host}${req.url}`);
  }

  // Redirect www to non-www
  if (host && host.startsWith("www.")) {
    return res.redirect(301, `https://${host.slice(4)}${req.url}`);
  }

  next();
});


// ✅ CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://growthaffinitymarketing.com', 'https://www.growthaffinitymarketing.com']
      : process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Access-Control-Allow-Origin', 'Set-Cookie']
  })
);

app.use(express.json());
app.use(cookieParser());

// Handle OPTIONS preflight requests for Safari
app.options('*', cors());

// Add specific headers for Safari cookie support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/purchase", purchaseRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.API_GATEWAY_PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
