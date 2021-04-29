const Department = require("../models/department");

exports.department_list = async (req, res) => {
  try {
    let all = await Department.find();
    res.json(all);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.department_single = async (req, res) => {
  try {
    let single = await Department.findById(req.params.id);
    res.json(single);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.department_create = async (req, res) => {
  const department = new Department({
    name: req.body.name,
    teachers: req.body.teachers ? req.body.teachers : [],
    lessons: req.body.lessons ? req.body.lessons : [],
  });
  try {
    const exists = await Department.where("name", `${req.body.name}`);
    if (!exists.length) {
      const savedDepartment = await department.save();
      return res.json(savedDepartment);
    }
    return res.json({ message: "Department already exists" });
  } catch (err) {
    return res.send(`${err}`);
  }
};

exports.department_update = (req, res) =>
  res.send(`department with id ${req.params.id} updated`);

exports.department_remove = (req, res) =>
  res.send(`department with id ${req.params.id} removed`);
