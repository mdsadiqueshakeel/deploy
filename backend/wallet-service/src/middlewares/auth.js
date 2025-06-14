const jwt = require("jsonwebtoken");

// Extract user from JWT token
exports.extractUser = (req, res, next) => {
  // Log the headers for debugging
  console.log("Headers received:", req.headers);
  console.log("Cookies received:", req.cookies);
  
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  
  if (!token) {
    console.log("No token found in request");
    return res.status(401).json({ message: "Token missing" });
  }

  console.log("Token found:", token.substring(0, 10) + "...");
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Exists" : "Missing");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);
    req.user = {
      _id: decoded.userId || decoded.id || decoded.adminId, // Handle both formats and adminId
      id: decoded.userId || decoded.id || decoded.adminId,  // Handle both formats and adminId
      isAdmin: decoded.isAdmin || false,
    };
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.isAuthenticated = (req, res, next) => {
  if (req.user?.id) return next();
  return res.status(401).json({ message: "Unauthorized" });
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  return res.status(403).json({ message: "Admin only" });
};

