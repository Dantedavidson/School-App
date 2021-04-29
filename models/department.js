const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

//Virtual for url
DepartmentSchema.virtual("url").get(function () {
  return `/departments/${this._id}`;
});

module.exports = mongoose.model("Department", DepartmentSchema);
