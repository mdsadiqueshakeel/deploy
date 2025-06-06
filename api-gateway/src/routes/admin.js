const express = require("express");
const router = express.Router();
const axios = require("axios");

const adminAuth = require('../middlewares/adminAuth');
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || "http://localhost:5002";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001";

//sameer
router.get("/verify", adminAuth, async (req, res) => {
  try {
    if (!req.cookies.adminToken) {
      return res.status(401).json({ message: "No token available to forward" });
    }

    const response = await axios.get(`${ADMIN_SERVICE_URL}/api/admin/verify`, {
      headers: {
        Authorization: `Bearer ${req.cookies.adminToken}`,
        'x-admin-token': req.cookies.adminToken
      },
      withCredentials: true
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Service error" }
    );
  }
});


// Logger for debug

// 🔐 Admin Login
try {
  const response = await axios.post(`${ADMIN_SERVICE_URL}/api/admin/login`, req.body);

  const token = response.data.token;

  // ✅ Set the cookie correctly for cross-origin access
  res
    .cookie("adminToken", token, {
      httpOnly: true,
      secure: true, // 🔥 Force this TRUE always on Railway (it's HTTPS anyway)
      sameSite: "None", // 🔥 Always "None" for cross-origin
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: 7 days
    })
    .status(200)
    .json({ message: "Admin logged in successfully" }); // 🔥 Don't send token again
} catch (err) {
  res
    .status(err.response?.status || 500)
    .json(err.response?.data || { error: "Service error" });
}


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
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: "localhost", // Ensure it matches the domain used in login
    });

    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout error", error: err.message });
  }
});

module.exports = router;
