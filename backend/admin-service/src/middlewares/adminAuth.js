const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Removed detailed logging of sensitive information
  
  const token =
    req.headers['x-admin-token'] ||
    req.cookies?.adminToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

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