const { Department, validateDepartment } = require("../models/department");
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
  let { error } = validateDepartment(req.body);
  if (error) res.json(error);
  console.log("i went off");
  const department = new Department({
    name: req.body.name,
    teachers: [],
    lessons: [],
  });
  try {
    let exists = await Helper.inDatabase(Department, "name", req.body.name);
    if (!exists) {
      if (req.body.teachers) {
        req.body.teachers.forEach((teacher) =>
          department.teachers.push(teacher)
        );
      }
      if (req.body.lessons) {
        req.body.lessons.forEach((lesson) => department.lesson.push(lesson));
      }
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

    //temp object
    const temp = {
      name: prev.name,
      teachers: prev.teachers,
      lessons: prev.lessons,
    };

    //check fields passed in
    if (req.body.name) {
      temp.name = req.body.name;
    }
    if (req.body.teacher) {
      temp.teachers.push(req.body.teacher);
    }
    if (req.body.lesson) {
      temp.lessons.push(req.body.lesson);
    }

    //Validate
    let { error } = validateDepartment(temp);
    if (error) res.json(error);
    //update database
    const update = await Department.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: temp.name,
          teachers: temp.teachers,
          lessons: temp.lessons,
        },
      }
    );

    //return update to user
    res.json(update);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.department_remove = async (req, res) => {
  try {
    const removed = await Department.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Department removed" });
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
};
