const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const TeacherSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  info: {
    account: {
      username: { type: String, required: true, maxLength: 36, minLength: 6 },
      password: { type: String, required: true, maxLength: 1024, minLength: 6 },
    },
    contact: {
      email: { type: String, maxLength: 100, minLength: 3 },
      phone: { type: String, maxLength: 10, minLength: 8 },
    },
  },
  age: { type: Number, required: true, min: 21 },
});

//Virtual for full name
TeacherSchema.virtual("name").get(function () {
  return `${this.first_name} ${this.family_name}`;
});

//Virtual for url
TeacherSchema.virtual("url").get(function () {
  return `/teachers/${this._id}`;
});

//Delete all references to teacher
TeacherSchema.pre("deleteOne", function (next) {
  const teacherId = this.getQuery()["_id"];
  mongoose
    .model("Department")
    .updateMany(
      { teachers: teacherId },
      { $pull: { teachers: `${teacherId}` } },
      function (err, result) {
        if (err) {
          return res.json({
            message: "Something went wrong when deleting from department",
          });
        }
      }
    );
  mongoose
    .model("Lesson")
    .deleteMany({ teacher: teacherId }, function (err, result) {
      if (err) {
        return res.json({
          message: "Something went wrong when removing from lesson",
        });
      } else {
        next();
      }
    });
});

const validateTeacher = (teacher) => {
  const schema = Joi.object({
    first_name: Joi.string().min(1).max(100).required(),
    family_name: Joi.string().min(3).max(100).required(),
    info: {
      account: {
        username: Joi.string().min(6).max(36).required(),
        password: Joi.string().min(6).max(1024).required(),
      },
      contact: {
        email: Joi.string().min(3).max(100).email(),
        phone: Joi.string()
          .min(8)
          .max(10)
          .regex(/[0-9]{8,10}/),
      },
    },
    age: Joi.number().min(18).max(70).required(),
  });
  return schema.validate(teacher);
};

module.exports.Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports.validateTeacher = validateTeacher;
