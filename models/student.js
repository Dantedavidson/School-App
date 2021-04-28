const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
});

//Virtual for full name
StudentSchema.virtual("name").get(function () {
  return `${this.family_name}, ${this.first_name}`;
});

//Virtual for url
StudentSchema.virtual("url").get(function () {
  return `/students/${this._id}`;
});

module.exports = mongoose.model("Student", StudentSchema);
