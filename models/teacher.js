const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
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
          console.log(`[error] ${err}`);
          next(err);
        } else {
          console.log("removed from department");
          next();
        }
      }
    );
  mongoose
    .model("Lesson")
    .deleteMany({ teacher: teacherId }, function (err, result) {
      if (err) {
        console.log(`Lesson [error] ${err}`);
        next(err);
      } else {
        console.log("Removed from lessons");
        next();
      }
    });
});

module.exports = mongoose.model("Teacher", TeacherSchema);
