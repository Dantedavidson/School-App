const { Student, validateStudent } = require("../models/student");

exports.student_list = async (req, res) => {
  try {
    const all = await Student.find();
    res.json(all);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.student_single = async (req, res) => {
  try {
    const single = await Student.findById(req.params.id);
    res.json(single);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.student_create = async (req, res) => {
  let { error } = validateStudent(req.body);
  if (error) res.json(error);
  const student = new Student({
    first_name: req.body.first_name,
    family_name: req.body.family_name,
  });
  try {
    const saved = await student.save();
    res.json(saved);
  } catch (err) {
    res.json({ message: err });
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
    console.log(err);
    res.json({ message: err });
  }
};

exports.student_remove = async (req, res) => {
  try {
    const removed = await Student.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Student removed" });
  } catch (err) {
    res.json({ message: err });
  }
};
