const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied! No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECERET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
}
module.exports = auth;
