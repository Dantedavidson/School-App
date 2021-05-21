const {
  User: Student,
  validateUser,
  validateAccount,
} = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.student_list = async (req, res) => {
  try {
    const all = await Student.find({ "account.access": "student" });
    res.json(all);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.student_single = async (req, res) => {
  try {
    const single = await Student.findById(req.params.id);
    res.json(single);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.student_recent = async (req, res) => {
  try {
    const recent = await Student.find({ "account.access": "student" })
      .sort({ "account.enrolled": -1 })
      .limit(5);
    res.json(recent);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.student_create = async (req, res) => {
  let { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error });

  //check account info is unique
  const user = await Student.findOne({
    $or: [
      { "details.email": req.body.details.email },
      { "account.username": req.body.account.username },
    ],
  });
  if (user) return res.status(409).send("This user already exists");
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.account.password, salt);
  const student = new Student({
    details: {
      first_name: req.body.details.first_name,
      family_name: req.body.details.family_name,
      email: req.body.details.email,
      phone: req.body.details.phone,
    },
    account: {
      username: req.body.account.username,
      access: req.body.account.access,
      password: hashedPassword,
    },
  });
  try {
    const saved = await student.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.student_login = async (req, res) => {
  //Validate login details
  const { error } = validateAccount(req.body);
  if (error) return res.status(400).json({ message: "Invalid Inputs" });
  try {
    //Check user exists
    const user = await Student.findOne({
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
    res.status(200).json({ user: token, message: "Log in success" });
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.student_update = async (req, res) => {
  let { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    // Check if another user has email or username
    const exists = await Student.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { "details.email": req.body.details.email },
        { "account.username": req.body.account.username },
      ],
    });
    if (exists)
      return res
        .status(409)
        .json({ message: "Email or Username already taken" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.account.password, salt);
    const update = await Student.updateOne(
      { _id: req.params.id },
      {
        $set: {
          details: {
            first_name: req.body.details.first_name,
            family_name: req.body.details.family_name,
            email: req.body.details.email,
            phone: req.body.details.phone,
          },
          account: {
            username: req.body.account.username,
            access: req.body.account.access,
            password: hashedPassword,
          },
        },
      }
    );
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.student_remove = async (req, res) => {
  try {
    const removed = await Student.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Student removed" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
