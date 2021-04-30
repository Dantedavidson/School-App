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

module.exports = mongoose.model("Teacher", TeacherSchema);
