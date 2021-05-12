const { Lesson, validateLesson } = require("../models/lesson");
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
  let { error } = validateLesson(req.body);
  if (error) return res.json(error);
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
    if (!exists) {
      const saved = await lesson.save();
      return res.json({ saved: saved, message: "Lesson saved" });
    }
    return res.json({ message: "Lesson already exists in database" });
  } catch (err) {
    res.json({ message: err });
  }
};

exports.lesson_update = async (req, res) => {
  try {
    const prev = await Lesson.findById(req.params.id);
    const obj = {
      name: prev.name,
      teacher: prev.teacher,
      students: prev.students,
    };
    if (req.body.name) {
      obj.name = req.body.name;
    }
    if (req.body.teacher) {
      obj.teacher = req.body.teacher;
    }
    if (req.body.students.length > 0) {
      req.body.students.forEach((student) => {
        obj.students.includes(student) ? null : obj.students.push(student);
      });
    }
    let { error } = validateLesson(obj);
    if (error) return res.json(error);
    const update = await Lesson.updateOne(
      { _id: req.params.id },
      { $set: { name: obj.name, teacher: obj.teacher, students: obj.students } }
    );
    res.json(update);
  } catch (err) {
    res.json({ message: `${err}` });
  }
};

exports.lesson_remove = async (req, res) => {
  try {
    const removed = await Lesson.deleteOne({ _id: req.params.id });
    res.json({ removed: removed, message: "Lesson removed" });
  } catch (err) {
    res.json({ message: err });
  }
};
