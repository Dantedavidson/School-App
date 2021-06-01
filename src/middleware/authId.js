function authId(allowAdmin) {
  return function (req, res, next) {
    if (allowAdmin && req.user.access === "admin") return next();
    if (req.user._id !== req.params.id) {
      return res
        .status(400)
        .json({ message: "You are not authorised to take this action." });
    }
    next();
  };
}
module.exports = authId;
