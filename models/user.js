const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

const validSubscriptions = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      values: [...validSubscriptions],
      default: "starter",
    },
    token: {
      type: String,
      default: " ",
    },
    avatarURL: {
      type: String,
      required: true,
  }
  },

  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(emailRegexp)).required().messages({
    "string.pattern.base": `Invalid email format`,
    "any.required": `Missing required email field`,
  }),
  password: Joi.string().min(6).required().messages({
    "string.password": `Invalid password format`,
    "any.required": `Missing required password field`,
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(emailRegexp)).required().messages({
    "string.pattern.base": `Invalid email format`,
    "any.required": `Missing required email field`,
  }),
  password: Joi.string().min(6).required().messages({
    "string.password": `Invalid password format`,
    "any.required": `Missing required password field`,
  }),
});

const updSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .required()
    .valid(...validSubscriptions)
    .messages({
      "any.required": `Missing required subscription field`,
      "any.only": `Invalid subscription value. Must be one of: ${validSubscriptions.join(
        ", "
      )}`,
    }),
});

const schemas = { registerSchema, loginSchema, updSubscriptionSchema };

const User = model("user", userSchema);

module.exports = { User, schemas };
