const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token =
    req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Normalize the user object to handle both userId and id formats
    req.user = {
      ...decoded,
      id: decoded.userId || decoded.id, // Ensure id is always available
    };
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
