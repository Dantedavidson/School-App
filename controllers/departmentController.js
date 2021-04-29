const Department = require("../models/department");
const Helper = require("./controllerHelperFunctions");

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
    let single = await Department.findById(req.params.id).populate("teachers");
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
    let exists = await Helper.inDatabase(Department, "name", req.body.name);
    if (!exists) {
      const saved = await department.save();
      return res.json(saved);
    }
    return res.json({ message: "Department already exists" });
  } catch (err) {
    return res.send(`${err}`);
  }
};

exports.department_update = async (req, res) => {
  try {
    const prev = await Department.findById(req.params.id);
    const update = await Department.updateOne(
      { _id: req.params.id },
      {
        $set: { name: req.body.name ? req.body.name : prev.name },
        $push: {
          teachers: req.body.teacher ? req.body.teacher : prev.teachers,
        },
      }
    );
    res.json(update);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.department_remove = (req, res) =>
  res.send(`department with id ${req.params.id} removed`);

// exports.department_populate = (req,res)=>{

// }
