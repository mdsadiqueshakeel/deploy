const express = require("express");
const router = express.Router();
const axios = require("axios");

const jwtAuth = require("../middlewares/jwtAuth");
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001";

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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({ message: "Logged in successfully", token });

  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/forgot-password`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/reset-password`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});


// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false in dev, true in prod
    sameSite: "lax",                               // "lax" is good for most apps
    path: "/"                                      // important to match the path used when setting the cookie
  });

  res.status(200).json({ message: "Logged out successfully" });
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

router.put("/change-password", async (req, res) => {
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

module.exports = router;
