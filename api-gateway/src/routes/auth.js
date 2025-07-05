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

// Login with enhanced cross-browser compatibility
router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/login`, req.body);
    const token = response.data.token;
    
    // Log user agent for debugging
    const userAgent = req.headers['user-agent'] || '';
    console.log(`User login attempt from: ${userAgent}`);
    
    // Detect Safari/iOS
    const isSafari = /safari/.test(userAgent.toLowerCase()) && !/chrome/.test(userAgent.toLowerCase());
    const isIOS = /iphone|ipad|ipod/.test(userAgent.toLowerCase());
    
    // Set cookie with appropriate options
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Required for HTTPS
      sameSite: "None", // Required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/", // Ensure cookie is available across the entire site
    };
    
    // Add special handling for Safari/iOS
    if (isSafari || isIOS) {
      console.log('Safari/iOS detected, applying special cookie handling');
      // Safari/iOS may need these headers
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // For Safari/iOS, set the cookie twice to ensure it's properly set
      res.cookie("token", token, cookieOptions);
      
      // Small delay to ensure cookie is set properly
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Set the cookie (again for Safari/iOS)
    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({ 
        message: "Logged in successfully", 
        token: token, // Always include token in response for sessionStorage
        userAgent: userAgent, // Include user agent for debugging
        isSafari: isSafari || isIOS // Include Safari/iOS flag for client-side handling
      });
  } catch (err) {
    console.error("User login error:", err.response?.data || err.message);
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

// Logout Route with enhanced cross-browser compatibility
router.post("/logout", (req, res) => {
  try {
    // Log user agent for debugging
    const userAgent = req.headers['user-agent'] || '';
    console.log(`User logout attempt from: ${userAgent}`);
    
    // Detect Safari/iOS
    const isSafari = /safari/.test(userAgent.toLowerCase()) && !/chrome/.test(userAgent.toLowerCase());
    const isIOS = /iphone|ipad|ipod/.test(userAgent.toLowerCase());
    
    // Clear the token from cookies with same settings as when it was set
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/"
    });
    
    // Add special handling for Safari/iOS
    if (isSafari || isIOS) {
      console.log('Safari/iOS detected, applying special headers for logout');
      // Safari/iOS may need these headers
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    // Return success response
    res.status(200).json({ 
      message: "Logged out successfully",
      userAgent: userAgent // Include user agent for debugging
    });
  } catch (error) {
    console.error("Logout error:", error);
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

// Check Auth Route with enhanced cross-browser compatibility
router.get("/check-auth", async (req, res) => {
  try {
    // Log user agent for debugging
    const userAgent = req.headers['user-agent'] || '';
    console.log(`Check auth attempt from: ${userAgent}`);
    
    // Detect Safari/iOS
    const isSafari = /safari/.test(userAgent.toLowerCase()) && !/chrome/.test(userAgent.toLowerCase());
    const isIOS = /iphone|ipad|ipod/.test(userAgent.toLowerCase());
    
    // Add special handling for Safari/iOS
    if (isSafari || isIOS) {
      console.log('Safari/iOS detected, applying special headers for check-auth');
      // Safari/iOS may need these headers
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    
    // Get token from cookie, Authorization header, or X-Token-Fallback header
    let token = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const fallbackToken = req.headers['x-token-fallback'];
    
    // If token not in cookie but in Authorization header, use that instead
    if (!token && authHeader) {
      token = authHeader.split(" ")[1];
      console.log('Token not found in cookie, using Authorization header');
    }
    
    // If still no token but we have a fallback token (for Safari/iOS), use that
    if (!token && fallbackToken) {
      token = fallbackToken;
      console.log('Using X-Token-Fallback header for Safari/iOS compatibility');
    }
    
    if (!token) {
      console.log('No token found in cookies or Authorization header');
      return res.json({ 
        authenticated: false,
        userAgent: userAgent,
        isSafari: isSafari || isIOS
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user data from user service
      const response = await axios.get(`${USER_SERVICE_URL}/api/auth/me`, {
        headers: {
          Cookie: `token=${token}`, // Forward token as cookie
          Authorization: `Bearer ${token}`, // Also forward as Authorization header
          'User-Agent': userAgent, // Forward user agent for consistent handling
        },
      });
      
      // For Safari/iOS, refresh the cookie to prevent expiration issues
      if (isSafari || isIOS) {
        console.log('Safari/iOS detected, refreshing token cookie after successful verification');
        
        // Re-set the cookie with the same token to refresh it
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          path: "/"
        });
      }
      
      return res.json({ 
        authenticated: true, 
        user: response.data,
        userAgent: userAgent // Include user agent for debugging
      });
    } catch (error) {
      console.error('Token verification failed:', error.message);
      // Invalid token
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"
      });
      return res.json({ 
        authenticated: false,
        userAgent: userAgent,
        isSafari: isSafari || isIOS,
        error: error.message
      });
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
