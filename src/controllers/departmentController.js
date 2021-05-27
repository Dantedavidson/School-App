const { Department, validateDepartment } = require("../models/department");
const Helper = require("./controllerHelperFunctions");

exports.department_list = async (req, res) => {
  try {
    let all = await Department.find();
    console.log(all);
    res.json(all);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.department_single = async (req, res) => {
  try {
    let single = await Department.findById(req.params.id).populate("teachers");
    res.json(single);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.department_create = async (req, res) => {
  let { error } = validateDepartment(req.body);
  if (error) res.status(400).json(error);

  const department = new Department({
    name: req.body.name,
    department_head: req.body.department_head,
    teachers: [],
    lessons: [],
  });
  try {
    let exists = await Helper.inDatabase(Department, "name", req.body.name);
    if (exists) {
      return res.status(409).json({ message: "Department already exists" });
    }
    if (req.body.teachers) {
      req.body.teachers.forEach((teacher) => department.teachers.push(teacher));
    }
    if (req.body.lessons) {
      req.body.lessons.forEach((lesson) => department.lesson.push(lesson));
    }
    const saved = await department.save();
    return res.json(saved);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

exports.department_update = async (req, res) => {
  let { error } = validateDepartment(req.body);
  if (error) res.status(400).json(error);

  try {
    const exists = await Department.findOne({
      _id: { $ne: req.params.id },
      name: req.body.name,
    });
    if (exists)
      return res
        .status(409)
        .json({ message: "There is another department with this name." });

    const update = await Department.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          teachers: req.body.teachers,
          lessons: req.body.lessons,
        },
      }
    );

    //return update to user
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.department_remove = async (req, res) => {
  try {
    const removed = await Department.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Department removed" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
