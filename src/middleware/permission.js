//TODO Write this function to optionally check for user id match id route. If too messy create seperate middleware to permite based on id
const jwt = require("jsonwebtoken");

function permission(role) {
  return function (req, res, next) {
    if (!role.includes(req.user.access)) {
      return res
        .status(400)
        .json({ message: "You are not authorised to take this action." });
    }
    next();
  };
}
module.exports = permission;
