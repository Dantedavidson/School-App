const Teacher = require("../models/teacher");
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
    let single = await Teacher.findById(req.params.id);
    res.json(single);
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

exports.teacher_update = (req, res) =>
  res.send(`teacher with id ${req.params.id} updated`);

exports.teacher_remove = (req, res) =>
  res.send(`teacher with id ${req.params.id} removed`);
