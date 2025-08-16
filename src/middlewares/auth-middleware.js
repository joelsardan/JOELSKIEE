// middlewares/auth-middleware.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = authenticate;
