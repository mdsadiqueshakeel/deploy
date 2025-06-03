const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token =
    req.cookies.adminToken || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) throw new Error("Not an admin");

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};
