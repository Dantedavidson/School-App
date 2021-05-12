const Joi = require("joi");
const JoiObj = require("joi-oid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

const validateLesson = (Lesson) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    teacher: JoiObj.objectId().required(),
    students: Joi.array().items(JoiObj.objectId()),
  });
  return schema.validate(Lesson);
};
const Lesson = mongoose.model("Lesson", LessonSchema);
module.exports.Lesson = Lesson;
module.exports.validateLesson = validateLesson;
