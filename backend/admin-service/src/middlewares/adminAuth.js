const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // ADD DEBUG LOG FOR HEADERS
  console.log('[Admin Service] Received headers:', req.headers);
  
  // Extract token from multiple sources
  const token = req.headers['x-admin-token'] || 
                req.cookies?.token || 
                (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  
  // ADD DEBUG LOG FOR EXTRACTED TOKEN
  console.log('[Admin Service] Extracted token:', token);
  
  if (!token) {
    console.error('[Admin Service] No token provided');
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) throw new Error("Not an admin");
    req.admin = decoded;
    next();
  } catch (err) {
    console.error('[Admin Service] JWT verification failed:', err.message);
    res.status(401).json({ message: "Unauthorized", detail: err.message });
  }
};