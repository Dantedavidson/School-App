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

//Virtual for url
LessonSchema.virtual("url").get(function () {
  return `/lessons/${this._id}`;
});

module.exports = mongoose.model("Lesson", LessonSchema);
