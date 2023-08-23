const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);
const Contact = model("contact", contactSchema);

const addSchema = Joi.object({
  name: Joi.string().min(3).required()
  .messages({"any.required": `missing required name field`}),
  email: Joi.string().required()
  .messages({"any.required": `missing required email field`}),
    phone: Joi.string().min(6).required()
    .messages({"any.required": `missing required phone field`}),
    favorite: Joi.boolean()
  });

const updFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
  .messages({"any.required": `missing field favorite`}),
});

const schemas = {
  addSchema,
  updFavoriteSchema,
};

module.exports = { Contact, schemas };