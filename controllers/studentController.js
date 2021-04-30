const Student = require("../models/student");

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

exports.student_update = (req, res) =>
  res.send(`Student with id ${req.params.id} updated`);

exports.student_remove = async (req, res) => {
  try {
    const removed = await Student.remove({ _id: req.params.id });
    res.json({ removed: removed, message: "Student removed" });
  } catch (err) {
    res.json({ message: err });
  }
};
