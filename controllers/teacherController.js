const Teacher = require("../models/teacher");
const Department = require("../models/department");
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
  const teacher = new Teacher({
    first_name: req.body.first_name,
    family_name: req.body.family_name,
    age: req.body.age,
  });
  try {
    const saved = await teacher.save();
    return res.json(saved);
  } catch (err) {
    return res.send(`${err}`);
  }
};

exports.teacher_update = async (req, res) =>
  res.send(`teacher with id ${req.params.id} updated`);

exports.teacher_remove = async (req, res) => {
  try {
    const removed = await Teacher.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Teacher removed" });
  } catch (err) {
    res.send({ message: err });
  }
};
