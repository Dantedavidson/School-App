const { Admin, validateAdmin } = require("../models/admin");
const validateLogin = require("../models/loginSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.admin_create = async (req, res) => {
  //validate
  let { error } = validateAdmin(req.body);
  if (error) return res.status(400).json(error);

  //check account info is unique
  const user = await Admin.findOne({
    username: req.body.username,
  });
  if (user) return res.status(409).send("This user already exists");

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    username: req.body.username,
    password: hashedPassword,
  });
  try {
    const saved = await admin.save();
    return res.json(saved);
  } catch (err) {
    return res.status(400).send(`${err}`);
  }
};

exports.admin_login = async (req, res) => {
  //Validate login details
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ message: "Invalid Inputs" });
  try {
    //Check user exists
    const user = await Admin.findOne({
      username: req.body.username,
    });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    //Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign(
      { _id: user._id, access: user.access },
      process.env.TOKEN_SECERET
    );

    //Return user
    res
      .status(200)
      .header("auth-token", token)
      .json({
        user: token,
        message: `Log in success. Logged in as ${user.access}`,
      });
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};
