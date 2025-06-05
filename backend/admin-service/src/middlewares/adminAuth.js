const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log('[Admin Service] Received headers:', req.headers);
  console.log('[Admin Service] Received cookies:', req.cookies);

  const token =
    req.headers['x-admin-token'] ||
    req.cookies?.adminToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  console.log('[Admin Service] Extracted token:', token);

  if (!token) {
    console.error('[Admin Service] No token provided');
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Admin Service] Decoded token:', decoded);
    if (!decoded.isAdmin) throw new Error("Not an admin");
    req.admin = decoded;
    next();
  } catch (err) {
    console.error('[Admin Service] JWT verification failed:', err.message);
    res.status(401).json({ message: "Unauthorized", detail: err.message });
  }
};