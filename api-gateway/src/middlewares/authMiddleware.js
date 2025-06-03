// middleware/authMiddleware.js
const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.token;
    
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