const Joi = require("joi");
const JoiObj = require("joi-oid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const YearGroupSchema = new Schema({
  year_group: { type: Number, required: true, min: 7, max: 13 },
  year_leader: { type: Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

//Virtual for url
YearGroupSchema.virtual("url").get(function () {
  return `/yeargroups/${this._id}`;
});

const validateYearGroup = (YearGroup) => {
  const schema = Joi.object({
    year_group: Joi.number().min(7).max(13).required(),
    year_leader: JoiObj.objectId().required(),
    students: Joi.array().items(JoiObj.objectId()),
  });
  return schema.validate(YearGroup);
};

module.exports.YearGroup = mongoose.model("YearGroup", YearGroupSchema);
module.exports.validateYearGroup = validateYearGroup;
