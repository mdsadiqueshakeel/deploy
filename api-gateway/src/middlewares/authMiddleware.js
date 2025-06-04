// middleware/authMiddleware.js
const protect = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header or cookie
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // 2. Verify token
    const decoded = verifyToken(token); // Your verification logic

    // 3. Get user and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};