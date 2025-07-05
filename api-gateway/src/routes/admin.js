const express = require("express");
const router = express.Router();
const axios = require("axios");
dotenv = require("dotenv");
dotenv.config();

const adminAuth = require('../middlewares/adminAuth');
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

//sameer
router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ message: "No token available to forward" });
    }

    const response = await axios.get(`${ADMIN_SERVICE_URL}/api/admin/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("VERIFY ERROR:", err?.response?.data || err.message);
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Service error" }
    );
  }
});




// Admin Login with enhanced cross-browser compatibility
router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(`${ADMIN_SERVICE_URL}/api/admin/login`, req.body);

    const token = response.data.token;
    
    // Log user agent for debugging
    console.log(`Admin login attempt from: ${req.headers['user-agent']}`);

    // Set cookie with enhanced cross-browser compatibility
    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: true, // Required for HTTPS
        sameSite: "None", // Required for cross-site cookies
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({ 
        message: "Admin logged in successfully",
        token: token // Always include token in response for sessionStorage
      });
  } catch (err) {
    console.error("Admin login error:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: "Service error" });
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
// router.get("/me", adminAuth, async (req, res) => {
//   try {
//     const response = await axios.get(`${ADMIN_SERVICE_URL}/api/admin/me`, {
//       headers: {
//         Authorization: req.headers.authorization, // forward token to admin-service
//       },
//     });

//     res.status(response.status).json(response.data);
//   } catch (err) {
//     res.status(err.response?.status || 500).json(
//       err.response?.data || { message: "Service error" }
//     );
//   }
// });

router.get("/profile", adminAuth, async (req, res) => {
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

router.delete("/delete-user/:id",adminAuth, async (req, res) => {
  try {
    const response = await axios.delete(`${USER_SERVICE_URL}/api/admin/delete-user/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to delete user" });
  }
});

router.post("/logout", (req, res) => {
  try {
    // Log user agent for debugging
    console.log(`Admin logout attempt from: ${req.headers['user-agent']}`);
    
    // Clear the cookie with same settings as when it was set
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/"
    });

    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (err) {
    console.error("Admin logout error:", err.message);
    res.status(500).json({ message: "Logout error", error: err.message });
  }
});



module.exports = router;
