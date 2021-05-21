const Joi = require("joi");
const JoiObj = require("joi-oid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  department_head: { type: Schema.Types.ObjectId, ref: "User" },
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

const validateDepartment = (Department) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    teachers: Joi.array().items(JoiObj.objectId()),
    department_head: JoiObj.objectId().required(),
    lessons: Joi.array().items(JoiObj.objectId()),
  });
  return schema.validate(Department);
};

module.exports.Department = mongoose.model("Department", DepartmentSchema);
module.exports.validateDepartment = validateDepartment;
