const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const jwtAuth = require("../middlewares/jwtAuth");

//sameer changed
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const INCOME_SERVICE_URL = process.env.INCOME_SERVICE_URL;

// Add this for better error logging
router.use((req, res, next) => {
  console.log(`[API Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Register
router.post("/register", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/login`, req.body);
    const token = response.data.token;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // 🔥 Railway is HTTPS so this MUST be true
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: "/", // Ensure cookie is aailable across the entire site
        domain: process.env.CLIENT_URL // Set domain for production
      })
      .status(200)
      .json({ message: "Logged in successfully", token });
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// Forgot Password - Fixed with enhanced logging
router.post("/forgot-password", async (req, res) => {
  console.log("API Gateway received /forgot-password request:", req.body);
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/forgot-password`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("API Gateway error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});
//Reset Password

router.post("/reset-password", async (req, res) => {
  console.log("API Gateway received reset-password request:", req.body);
  try {
    const response = await axios.post(
      `${USER_SERVICE_URL}/api/auth/reset-password`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("API Gateway reset-password error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    res.status(err.response?.status || 500).json(
      err.response?.data || { error: "Service error" }
    );
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // 🔥 Railway is HTTPS so this MUST be true
      sameSite: "None",
      path: "/", // important to match the path used when setting the cookie
      domain: process.env.CLIENT_URL// Match domain setting from login
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/referral/validate/:code", async (req, res) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/referral/validate/${req.params.code}`
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { error: "Service error" }
    );
  }
});

// API Gateway
// api-gateway/routes/auth.js
router.get("/me", jwtAuth, async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/auth/me`, {
      headers: {
        Cookie: req.headers.cookie, // ✅ forward full cookie string to user-service
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: "Service error" });
  }
});

// Check Auth Route
router.get("/check-auth", async (req, res) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.json({ authenticated: false });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user data from user service
      const response = await axios.get(`${USER_SERVICE_URL}/api/auth/me`, {
        headers: {
          Cookie: `token=${token}`, // Forward token as cookie
        },
      });
      
      return res.json({ authenticated: true, user: response.data });
    } catch (error) {
      // Invalid token
      res.clearCookie("token");
      return res.json({ authenticated: false });
    }
  } catch (error) {
    console.error("Check auth error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/change-password", jwtAuth, async (req, res) => {
  try {
    const response = await axios.put(`${USER_SERVICE_URL}/api/auth/change-password`, req.body, {
      headers: {
        Cookie: req.headers.cookie, // Pass token cookie along
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

router.put("/profile", jwtAuth, async (req, res) => {
  try {
    const response = await axios.put(`${USER_SERVICE_URL}/api/auth/profile`, req.body, {
      headers: {
        Cookie: req.headers.cookie, // Pass token cookie along
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

router.get("/income", jwtAuth, async (req, res) => {
  try {
    const response = await axios.get(`${INCOME_SERVICE_URL}/api/income`, {
      headers: {
        Cookie: req.headers.cookie, // Pass token cookie along
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

module.exports = router;
