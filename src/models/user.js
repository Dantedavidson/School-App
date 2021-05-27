const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const JoiObj = require("joi-oid");
const { DateTime } = require("luxon");

const userSchema = new Schema({
  details: {
    first_name: {
      type: String,
      required: function () {
        return ["teacher", "student"].includes(this.account.access);
      },
      maxLength: 100,
    },
    family_name: {
      type: String,
      required: function () {
        return ["teacher", "student"].includes(this.account.access);
      },
      maxLength: 100,
    },
    age: {
      type: Number,
      required: function () {
        return ["teacher"].includes(this.account.access);
      },
      min: 21,
    },
    email: { type: String, maxLength: 100, minLength: 3 },
    phone: { type: String, maxLength: 10, minLength: 8 },
  },
  account: {
    username: { type: String, required: true, maxLength: 36, minLength: 6 },
    password: { type: String, required: true, maxLength: 1024, minLength: 6 },
    access: {
      type: String,
      enum: ["teacher", "student", "admin"],
      required: true,
    },
    enrolled: { type: Date, required: true, default: DateTime.now() },
  },
});

userSchema.virtual("fullname").get(function () {
  return `${this.details.first_name}, ${this.details.family_name}`;
});

const accountSchema = Joi.object({
  username: Joi.string().min(6).max(36).required(),
  password: Joi.string().min(6).max(36).required(),
  access: Joi.string().valid("teacher", "student", "admin").required(),
});

const validateAccount = (account) => {
  return accountSchema.validate(account);
};

const validateUser = (user) => {
  const schema = Joi.object({
    details: {
      first_name: Joi.string().min(1).max(100).required(),
      family_name: Joi.string().min(3).max(100).required(),
      email: Joi.string().min(3).max(100).email(),
      phone: Joi.string()
        .min(8)
        .max(10)
        .regex(/[0-9]{8,10}/),
      age: Joi.number().when("account.access", {
        is: "teacher",
        then: Joi.number().min(18).max(80).required(),
        otherwise: Joi.optional(),
      }),
    },
    account: accountSchema,
  });
  return schema.validate(user);
};

module.exports.validateAccount = validateAccount;
module.exports.validateUser = validateUser;
module.exports.User = mongoose.model("User", userSchema);
