const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("token="))
      ?.split("=")[1];
      
    if (!token) {
      return res.status(404).json({ message: "User not found" });
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
