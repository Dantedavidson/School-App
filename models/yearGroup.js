const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const YearGroupSchema = new Schema({
  year_group: { type: Number, required: true, min: 7, max: 13 },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

//Virtual for url
StudentSchema.virtual("url").get(function () {
  return `/yeargroups/${this._id}`;
});

module.exports = mongoose.model("Year_group", YearGroupSchema);
