const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    if (!token) {
      return res.status(400).json({
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid token or expired",
    });
  }
};
