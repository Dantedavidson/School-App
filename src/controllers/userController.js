const { User, validateAccount, validateUser } = require("../models/user");
const validateLogin = require("../models/loginSchema");
const { Department } = require("../models/department");
const { YearGroup } = require("../models/yearGroup");
const bcrypt = require("bcrypt");
const Helper = require("./controllerHelperFunctions");
const jwt = require("jsonwebtoken");

module.exports.user_create = async (req, res) => {
  console.log(req.body);
  let { error } = validateAccount(req.body);
  if (error) return res.status(400).json(error);
  const { username, password, access } = req.body;
  const user = new User({
    account: {
      username: username,
      password: password,
      access: access,
    },
  });
  try {
    const saved = await user.save(req.body);
    res.json(saved);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
