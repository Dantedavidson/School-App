const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const StudentSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
});

//Virtual for full name
StudentSchema.virtual("name").get(function () {
  return `${this.family_name}, ${this.first_name}`;
});

//Remove all references of student
StudentSchema.pre("deleteOne", function (next) {
  const studentId = this.getQuery(["_id"]);
  mongoose
    .model("Lesson")
    .updateMany(
      { students: studentId },
      { $pull: { students: studentId } },
      function (err, result) {
        if (err) {
          return res.json({
            message: "Something went wrong when deleting from Lesson",
          });
        }
      }
    );
  mongoose
    .model("YearGroup")
    .updateOne(
      { students: studentId },
      { $pull: { students: studentId } },
      function (err, result) {
        if (err) {
          return res.json({
            message: "Something went wrong when deleting from Year group",
          });
        }
      }
    );
});

const validateStudent = (student) => {
  const schema = Joi.object({
    first_name: Joi.string().min(1).max(100).required(),
    family_name: Joi.string().min(3).max(100).required(),
  });
  return schema.validate(student);
};
const Student = mongoose.model("Student", StudentSchema);
module.exports.Student = Student;
module.exports.validateStudent = validateStudent;
