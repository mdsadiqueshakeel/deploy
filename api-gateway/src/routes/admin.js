const express = require("express");
const router = express.Router();
const axios = require("axios");

const adminAuth = require("../middlewares/adminAuth");
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || "http://localhost:5002";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001";

//sameer

// Debug log added here
router.get("/verify", adminAuth, async (req, res) => {
  try {
    // ADD DEBUG LOGS
    console.log('[Gateway] Received token:', req.headers.authorization);
    console.log('[Gateway] Forwarding to:', ADMIN_SERVICE_URL);
    
    const headers = {
      Authorization: req.headers.authorization,
      'x-admin-token': req.headers.authorization?.split(' ')[1] || ''
    };

    const response = await axios.get(`${ADMIN_SERVICE_URL}/api/admin/verify`, {
      headers
    });
    
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('[Gateway] Verify error:', err.message);
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

    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Admin logged in", token });
  } catch (err) {
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
    const response = await axios.get(`${ADMIN_SERVICE_URL}/api/admin/users`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Service error" });
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
    console.error("🔥 ERROR calling user-service:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });

    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Service error", detail: err.message }
    );
  }
});


router.post("/logout", (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout error", error: err.message });
  }
});


module.exports = router;
