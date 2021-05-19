const { Teacher, validateTeacher } = require("../models/teacher");
const validateLogin = require("../models/loginSchema");
const { Department } = require("../models/department");
const { YearGroup } = require("../models/yearGroup");
const bcrypt = require("bcrypt");
const Helper = require("./controllerHelperFunctions");
const jwt = require("jsonwebtoken");

exports.teacher_list = async (req, res) => {
  try {
    let teachers = await Teacher.find();
    // let all = teachers.map((teacher) => {
    //   let department = await Department.find({ teachers: teacher._id });
    //   return { ...teacher, department: department };
    // });
    let all = [];
    for await (teacher of teachers) {
      let department = await Department.find({ teachers: teacher._id }).select(
        "name"
      );
      console.log(department);
      all.push({
        teacher,
        department: department.length > 0 ? department[0].name : null,
      });
    }

    res.json(all);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.teacher_single = async (req, res) => {
  try {
    let department = await Department.find({
      teachers: `${req.params.id}`,
    });
    let single = await Teacher.findById(req.params.id);
    res.json({ teacher_info: single, department_info: department });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.year_leaders = async (req, res) => {
  try {
    let year_leaders = await YearGroup.find()
      .select("year_leader year_group")
      .populate({ path: "year_leader", select: "_id first_name family_name" });
    console.log(year_leaders);
    res.json(year_leaders);
  } catch (err) {
    res.status(400).json({ message: "Resource not found" });
  }
};

exports.teacher_recent = async (req, res) => {
  try {
    let recent = await Teacher.find()
      .sort({ "info.account.enrollment": -1 })
      .limit(5);
    res.json(recent);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.teacher_create = async (req, res) => {
  //validate
  let { error } = validateTeacher(req.body);
  if (error) return res.status(400).json(error);

  //check account info is unique
  const user = await Teacher.findOne({
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

  const teacher = new Teacher({
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
    age: req.body.age,
  });
  try {
    const saved = await teacher.save();
    return res.json(saved);
  } catch (err) {
    return res.status(400).send(`${err}`);
  }
};

exports.teacher_login = async (req, res) => {
  //Validate login details
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ message: "Invalid Inputs" });
  try {
    //Check user exists
    const user = await Teacher.findOne({
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
    res
      .status(200)
      .header("auth-token", token)
      .json({ user: token, message: "Log in success" });
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.teacher_update = async (req, res) => {
  let { error } = validateTeacher(req.body);
  if (error) return res.status(400).json(error);
  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      req.body.info.account.password,
      salt
    );
    const update = await Teacher.updateOne(
      { _id: req.params.id },
      {
        $set: {
          first_name: req.body.first_name,
          family_name: req.body.family_name,
          age: req.body.age,
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
        },
      }
    );
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
};

exports.teacher_remove = async (req, res) => {
  try {
    const removed = await Teacher.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Teacher removed" });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};
