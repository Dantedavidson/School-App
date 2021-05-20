const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const { DateTime } = require("luxon");

const StudentSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  info: {
    account: {
      username: { type: String, required: true, maxLength: 36, minLength: 6 },
      password: { type: String, required: true, maxLength: 1024, minLength: 6 },
      access: { type: String, enum: ["student"], default: "student" },
      enrolled: { type: Date, required: true, default: DateTime.now() },
    },
    contact: {
      email: { type: String, maxLength: 100, minLength: 3 },
      phone: { type: String, maxLength: 10, minLength: 8 },
    },
  },
});
StudentSchema.virtual("fullname", function () {
  return `${this.first_name} ${this.family_name}`;
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
    info: {
      account: {
        username: Joi.string().min(6).max(36).required(),
        password: Joi.string().min(6).max(36).required(),
      },
      contact: {
        email: Joi.string().min(3).max(100).email(),
        phone: Joi.string()
          .min(8)
          .max(10)
          .regex(/[0-9]{8,10}/),
      },
    },
  });
  return schema.validate(student);
};
const Student = mongoose.model("Student", StudentSchema);
module.exports.Student = Student;
module.exports.validateStudent = validateStudent;
