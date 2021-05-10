const { Teacher, validateTeacher } = require("../models/teacher");
const { Department } = require("../models/department");
const bycrypt = require("bcrypt");
const Helper = require("./controllerHelperFunctions");

exports.teacher_list = async (req, res) => {
  try {
    let all = await Teacher.find();
    res.json(all);
  } catch (err) {
    res.json({ message: err });
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
    res.json({ message: err });
  }
};

exports.teacher_create = async (req, res) => {
  //validate
  let { error } = validateTeacher(req.body);
  if (error) return res.json(error);

  //check account info is unique
  const user = await Teacher.findOne({
    $or: [
      { "info.contact.email": req.body.info.contact.email },
      { "info.account.username": req.body.info.account.username },
    ],
  });
  if (user) return res.send("This user already exists");

  //hash password
  const salt = await bcrypt.genSalt(10);

  const teacher = new Teacher({
    first_name: req.body.first_name,
    family_name: req.body.family_name,
    info: {
      account: {
        username: req.body.info.account.username,
        password: req.body.info.account.password,
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
    return res.send(`${err}`);
  }
};

exports.teacher_update = async (req, res) => {
  try {
    const prev = await Teacher.findById(req.params.id);
    const obj = {
      first_name: prev.first_name,
      family_name: prev.family_name,
      age: prev.age,
    };
    if (req.body.first_name) {
      obj.first_name = req.body.first_name;
    }
    if (req.body.family_name) {
      obj.family_name = req.body.family_name;
    }
    if (req.body.age) {
      obj.age = req.body.age;
    }

    let { error } = validateTeacher(obj);
    if (error) return res.json(error);

    const update = await Teacher.updateOne(
      { _id: req.params.id },
      {
        $set: {
          first_name: obj.first_name,
          family_name: obj.family_name,
          age: obj.age,
        },
      }
    );
    res.json(update);
  } catch (err) {
    res.json({ message: `${err}` });
  }
};

exports.teacher_remove = async (req, res) => {
  try {
    const removed = await Teacher.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Teacher removed" });
  } catch (err) {
    res.send({ message: err });
  }
};
