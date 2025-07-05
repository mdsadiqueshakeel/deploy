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

// ✅ Force HTTPS + Redirect www → non-www
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

// ✅ CORS middleware
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      const allowedOrigins = [
        process.env.CLIENT_URL,
        'https://growthaffinitymarketing.com',
        'https://www.growthaffinitymarketing.com',
        'http://localhost:3000'
      ];
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Cache-Control"],
    exposedHeaders: ["Access-Control-Allow-Origin", "Set-Cookie"],
  })
);

// ✅ Preflight OPTIONS support (important for Safari and iOS)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const allowedOrigins = [
      "https://growthaffinitymarketing.com",
      "https://www.growthaffinitymarketing.com",
      "http://localhost:3000"
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin))  {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Cache-Control");
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours - reduce preflight requests for better performance
    return res.sendStatus(204); // Safari needs this clean end
  }
  next();
});


// ✅ Add credentials header support and Safari-specific headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Check if the request is from Safari or iOS
  const userAgent = req.headers['user-agent'] || '';
  const isSafariOrIOS = /^((?!chrome|android).)*safari/i.test(userAgent) || /iphone|ipad|ipod/i.test(userAgent);
  
  if (isSafariOrIOS) {
    // Add Safari/iOS specific headers
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
  }
  
  next();
});

app.use(express.json());
app.use(cookieParser());

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
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
