const Joi = require("joi");

const candidateSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "Name should contain only alphabets",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters"
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Enter a valid email",
      "string.empty": "Email is required"
    }),

  experience: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Experience must be a number",
      "number.min": "Experience cannot be negative"
    }),

  skills: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one skill is required"
    }),

  targetRole: Joi.string()
    .required()
    .messages({
      "string.empty": "Please select a target role"
    })
});

module.exports = { candidateSchema };