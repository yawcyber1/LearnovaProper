const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {id: decoded.userId};
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};
