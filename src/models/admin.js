const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const AdminSchema = new Schema({
  username: { type: String, required: true, maxLength: 36, minLength: 6 },
  password: { type: String, required: true, maxLength: 1024, minLength: 6 },
  access: { type: String, enum: ["admin"], default: "admin" },
});

const validateAdmin = (admin) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(36).required(),
    password: Joi.string().min(6).max(36).required(),
  });
  return schema.validate(admin);
};

const Admin = mongoose.model("Admin", AdminSchema);
module.exports.Admin = Admin;
module.exports.validateAdmin = validateAdmin;
