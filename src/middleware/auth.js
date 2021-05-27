const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  console.log(req.headers);
  console.log("Token:", token);
  if (!token) {
    return res.status(401).send("Access Denied! No token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECERET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
}
module.exports = auth;
