const { Lesson, validateLesson } = require("../models/lesson");
const Helper = require("./controllerHelperFunctions");
const User = require("../models/user");

exports.lesson_list = async (req, res) => {
  try {
    const all = await Lesson.find().populate([
      {
        path: "students",
        model: "User",
        select: "details fullname",
      },
      {
        path: "teacher",
        model: "User",
        select: "details fullname",
      },
    ]);
    res.json(all);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
//TODO populate teacher and students
exports.lesson_single = async (req, res) => {
  try {
    const single = await Lesson.findById({ _id: req.params.id }).populate([
      {
        path: "students",
        model: "User",
        select: "details fullname",
      },
      {
        path: "teacher",
        model: "User",
        select: "details fullname",
      },
    ]);
    res.json(single);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.lesson_create = async (req, res) => {
  let { error } = validateLesson(req.body);
  if (error) return res.status(400).json(error);
  const lesson = new Lesson({
    name: req.body.name,
    teacher: req.body.teacher,
    students: [],
  });
  try {
    const exists = await Helper.inDatabase(Lesson, "name", req.body.name);
    if (req.body.students) {
      req.body.students.forEach((student) => lesson.students.push(student));
    }
    if (exists) {
      return res
        .status(409)
        .json({ message: "Lesson already exists in database" });
    }
    const saved = await lesson.save();
    return res.json({ saved: saved, message: "Lesson saved" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.lesson_update = async (req, res) => {
  let { error } = validateLesson(req.body);
  if (error) return res.status(400).json(error);
  try {
    const exists = await Lesson.findOne({
      _id: { $ne: req.params.id },
      name: req.body.name,
    });
    if (exists)
      return res
        .status(409)
        .json({ message: "There is already a lesson with this name." });

    const update = await Lesson.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          teacher: req.body.teacher,
          students: req.body.students,
        },
      }
    );
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.lesson_remove = async (req, res) => {
  try {
    const removed = await Lesson.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Lesson removed" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
