const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Check for token in cookies or Authorization header
  let token = req.cookies.adminToken;
  
  // If no token in cookies, check Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) throw new Error("Not an admin");
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};