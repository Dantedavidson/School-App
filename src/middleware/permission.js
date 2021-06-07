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
