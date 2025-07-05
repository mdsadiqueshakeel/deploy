const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Log user agent for debugging
  const userAgent = req.headers['user-agent'] || '';
  console.log(`JWT Auth middleware processing request from: ${userAgent}`);
  
  // Detect Safari/iOS
  const isSafari = /safari/.test(userAgent.toLowerCase()) && !/chrome/.test(userAgent.toLowerCase());
  const isIOS = /iphone|ipad|ipod/.test(userAgent.toLowerCase());
  
  // Get token from cookie, Authorization header, or X-Token-Fallback header
  let token = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const fallbackToken = req.headers['x-token-fallback'];
  
  // If token not in cookie but in Authorization header, use that instead
  if (!token && authHeader) {
    token = authHeader.split(" ")[1];
    console.log('Token not found in cookie, using Authorization header');
  }
  
  // If still no token but we have a fallback token (for Safari/iOS), use that
  if (!token && fallbackToken) {
    token = fallbackToken;
    console.log('Using X-Token-Fallback header for Safari/iOS compatibility');
  }
  
  if (!token) {
    console.log('No token found in cookies or Authorization header');
    return res.status(401).json({ 
      error: "Token missing",
      userAgent: userAgent,
      isSafari: isSafari || isIOS
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // For Safari/iOS, refresh the cookie to prevent expiration issues
    if (isSafari || isIOS) {
      console.log('Safari/iOS detected, refreshing token cookie');
      
      // Set cache control headers for Safari/iOS
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // Re-set the cookie with the same token to refresh it
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: "/"
      });
    }
    
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(403).json({ 
      message: "Invalid or expired token",
      userAgent: userAgent,
      isSafari: isSafari || isIOS
    });
  }
};
