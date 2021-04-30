const Lesson = require("../models/lesson");
const Helper = require("./controllerHelperFunctions");

exports.lesson_list = async (req, res) => {
  try {
    const all = await Lesson.find();
    res.json(all);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.lesson_single = async (req, res) => {
  try {
    const single = await Lesson.findById({ _id: req.params.id });
    res.json(single);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.lesson_create = async (req, res) => {
  const lesson = new Lesson({
    name: req.body.name,
    teacher: req.body.teacher,
    students: req.body.students ? req.body.students : [],
  });
  try {
    const exists = await Helper.inDatabase(Lesson, "name", req.body.name);
    if (!exists) {
      const saved = await lesson.save();
      return res.json({ saved: saved, message: "Lesson saved" });
    }
    return res.json({ message: "Lesson already exists in database" });
  } catch (err) {
    res.json({ message: err });
  }
};

exports.lesson_update = async (req, res) =>
  res.send(`lesson with id ${req.params.id} updated`);

exports.lesson_remove = async (req, res) => {
  try {
    const removed = await Lesson.remove({ _id: req.params.id });
    res.json({ removed: removed, message: "Lesson removed" });
  } catch (err) {
    res.json({ message: err });
  }
};
