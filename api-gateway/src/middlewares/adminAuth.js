const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get token from cookie or Authorization header
  let token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
  
  // Debug logging in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('[adminAuth] Token source:', {
      fromCookie: !!req.cookies.adminToken,
      fromHeader: !!req.headers.authorization,
      cookieNames: Object.keys(req.cookies || {})
    });
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) throw new Error("Not an admin");
    req.admin = decoded;
    
    // Add token to headers for forwarding to microservices
    req.headers.authorization = `Bearer ${token}`;
    
    next();
  } catch (error) {
    console.error('[adminAuth] Token verification failed:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};