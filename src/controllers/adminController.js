const { User: Admin, validateAccount } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.admin_create = async (req, res) => {
  //validate
  let { error } = validateAccount(req.body);
  if (error) return res.status(400).json(error);

  //check account info is unique
  const user = await Admin.findOne({
    "account.username": req.body.username,
  });
  if (user) return res.status(409).send("This user already exists");

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    account: {
      username: req.body.username,
      access: req.body.access,
      password: hashedPassword,
    },
  });
  try {
    const saved = await admin.save();
    return res.json(saved);
  } catch (err) {
    return res.status(400).send(`${err}`);
  }
};

exports.admin_login = async (req, res) => {
  console.log("i went off");
  //Validate login details
  const { error } = validateAccount(req.body);
  if (error) return res.status(400).json({ message: "Invalid Inputs" });
  try {
    //Check user exists
    const user = await Admin.findOne({
      "account.username": req.body.username,
    });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    //Check password
    const validPass = await bcrypt.compare(
      req.body.password,
      user.account.password
    );
    if (!validPass)
      return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign(
      { _id: user._id, access: user.account.access },
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
