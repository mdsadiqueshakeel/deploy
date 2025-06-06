const express = require("express");
const router = express.Router();
const axios = require("axios");

const adminAuth = require('../middlewares/adminAuth');
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || "http://localhost:5002";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001";

// Admin verification endpoint
router.get("/verify", adminAuth, async (req, res) => {
  try {
    // Get token from either cookie or auth header
    const token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token available to forward" });
    }
    
    // Debug logging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[API Gateway] Verifying admin with token source:', {
        fromCookie: !!req.cookies.adminToken,
        fromHeader: !!req.headers.authorization,
        cookieNames: Object.keys(req.cookies || {})
      });
    }

    const response = await axios.get(`${ADMIN_SERVICE_URL}/api/admin/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-admin-token': token
      },
      withCredentials: true
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('[API Gateway] Admin verify error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Service error" }
    );
  }
});


// Logger for debug
router.use((req, res, next) => {
  console.log(`[API Gateway - Admin] ${req.method} ${req.originalUrl}`);
  next();
});

// 🔐 Admin Login
router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(`${ADMIN_SERVICE_URL}/api/admin/login`, req.body);
    const token = response.data.token;
    
    // Debug logging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[API Gateway] Setting admin cookie with token');
    }

    // Set cookie with proper configuration for cross-origin requests
    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use 'none' in production for cross-site requests
        path: "/",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      })
      .status(200)
      .json({ message: "Admin logged in successfully", token: token });
  } catch (err) {
    console.error('[API Gateway] Admin login error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// 🔁 Change Admin Password
router.put("/change-password", adminAuth, async (req, res) => {
  try {
    const response = await axios.put(`${ADMIN_SERVICE_URL}/api/admin/change-password`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
  }
});

// ✅ Get Admin Profile (for dashboard)
router.get("/me", adminAuth, async (req, res) => {
  try {
    const response = await axios.get(`${ADMIN_SERVICE_URL}/api/admin/me`, {
      headers: {
        Authorization: req.headers.authorization, // forward token to admin-service
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Service error" }
    );
  }
});


// 📋 Get All Users (admin dashboard)
router.get("/users", adminAuth, async (req, res) => {
  try {
    if (!ADMIN_SERVICE_URL) {
      return res.status(500).json({ message: "Admin service URL not configured" });
    }

    const response = await axios.get(`${ADMIN_SERVICE_URL}/api/admin/users`, {
      headers: { 
        Authorization: req.headers.authorization
      }
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { 
        message: "Service error",
        detail: err.message
      }
    );
  }
});

// 👤 Get Single User by ID via User-Service
router.get("/user/:id", adminAuth, async (req, res) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/admin/user/${req.params.id}`,
      {
        headers: {
          Authorization: req.headers.authorization
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Service error", detail: err.message }
    );
  }
});


router.post("/logout", (req, res) => {
  try {
    // Clear cookie with proper configuration matching the login cookie settings
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      // Don't specify domain to ensure it works across environments
    });

    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (err) {
    console.error('[API Gateway] Admin logout error:', err.message);
    res.status(500).json({ message: "Logout error", error: err.message });
  }
});

module.exports = router;
