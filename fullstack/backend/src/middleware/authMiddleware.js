const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "healpoint-dev-secret";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    req.user = jwt.verify(token, secret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access is required" });
  }
  return next();
}

module.exports = {
  adminMiddleware,
  authMiddleware,
};
