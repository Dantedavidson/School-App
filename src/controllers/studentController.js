const {
  User: Student,
  validateUser,
  validateAccount,
} = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { YearGroup } = require("../models/yearGroup");
const { Lesson } = require("../models/lesson");

exports.student_list = async (req, res) => {
  try {
    let tempArr = [];
    const all = await Student.find({ "account.access": "student" });

    for await (student of all) {
      let yeargroup = await YearGroup.findOne({ students: student._id }).select(
        "year_group"
      );
      console.log(yeargroup);
      const tempObj = {
        details: {
          ...student.details.toObject(),
          fullname: student.fullname,
          yeargroup: yeargroup
            ? yeargroup.year_group.toString()
            : "No Yeargroup",
        },
        account: {
          enrolled: student.account.enrolled,
        },
        id: student._id,
      };
      tempArr.push(tempObj);
    }
    res.json(tempArr);
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.student_single = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const yeargroup = await YearGroup.findOne({ students: student._id }).select(
      "year_group"
    );
    const lessons = await Lesson.find({ students: student._id }).select(
      "name teacher"
    );
    const tempObj = {
      details: {
        ...student.details.toObject(),
        yeargroup: yeargroup ? yeargroup.year_group.toString() : "No Yeargroup",
        lessons: lessons,
      },
      account: {
        enrolled: student.account.enrolled,
      },
      id: student._id,
    };
    res.json(tempObj);
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.student_recent = async (req, res) => {
  try {
    const recent = await Student.find({ "account.access": "student" })
      .sort({ "account.enrolled": -1 })
      .limit(5);
    const tempArr = [];
    recent.forEach((item) => {
      const tempObj = {
        details: {
          ...item.details.toObject(),
          fullname: item.fullname,
        },
        account: {
          enrolled: item.account.enrolled,
        },
      };
      tempArr.push(tempObj);
    });

    res.json(tempArr);
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.student_create = async (req, res) => {
  //let { error } = validateUser(req.body);
  //if (error) return res.status(400).json({ message: error });

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
