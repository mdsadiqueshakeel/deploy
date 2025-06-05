const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.cookies.adminToken;

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