const { Student, validateStudent } = require("../models/student");
const validateLogin = require("../models/loginSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.student_list = async (req, res) => {
  try {
    const all = await Student.find();
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
    const recent = await Student.find()
      .sort({ "info.account.enrolled": -1 })
      .limit(5);
    res.json(recent);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.student_create = async (req, res) => {
  let { error } = validateStudent(req.body);
  if (error) return res.status(400).json({ message: `${error}` });

  //check account info is unique
  const user = await Student.findOne({
    $or: [
      { "info.contact.email": req.body.info.contact.email },
      { "info.account.username": req.body.info.account.username },
    ],
  });
  if (user) return res.status(409).send("This user already exists");
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    req.body.info.account.password,
    salt
  );
  const student = new Student({
    first_name: req.body.first_name,
    family_name: req.body.family_name,
    info: {
      account: {
        username: req.body.info.account.username,
        password: hashedPassword,
      },
      contact: {
        email: req.body.info.contact.email,
        phone: req.body.info.contact.phone,
      },
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
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ message: "Invalid Inputs" });
  try {
    //Check user exists
    const user = await Student.findOne({
      "info.account.username": req.body.username,
    });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    //Check password
    const validPass = await bcrypt.compare(
      req.body.password,
      user.info.account.password
    );
    if (!validPass)
      return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign(
      { _id: user._id, access: user.info.account.access },
      process.env.TOKEN_SECERET
    );

    //Return user
    res.status(200).json({ user: token, message: "Log in success" });
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.student_update = async (req, res) => {
  try {
    // Store current version
    const prev = await Student.findOne({ _id: req.params.id });

    const temp = {
      first_name: prev.first_name,
      family_name: prev.family_name,
    };

    //Check if fields are present
    if (req.body.first_name) {
      temp.first_name = req.body.first_name;
    }
    if (req.body.family_name) {
      temp.family_name = req.body.family_name;
    }

    //Validate
    let { error } = validateStudent(temp);
    if (error) return res.status(400).json(error);

    //Update fields
    const update = await Student.updateOne(
      { _id: req.params.id },
      {
        $set: {
          first_name: temp.first_name,
          family_name: temp.family_name,
        },
      }
    );

    //return update to user
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
