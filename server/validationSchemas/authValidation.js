// validation/authValidation.js
const Joi = require("joi");

// Register validation
const registerSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.pattern.base": "Name must contain only alphabets",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 50 characters",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
    }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be 8+ chars with uppercase, lowercase, and a number",
    }),

  role: Joi.string()
    .valid("candidate", "recruiter")
    .required()
    .messages({
      "any.only": "Role must be either candidate or recruiter",
      "string.empty": "Role is required",
    }),

  targetRole: Joi.string().optional().allow("")
    .messages({
      "any.required": "Target role is required for candidates",
    }),

  experience: Joi.number().optional().empty("")
    .min(0)
    .messages({
      "number.base": "Experience must be a number",
      "number.min": "Experience cannot be negative",
      "any.required": "Experience is required for candidates",
    }),
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});// validation/authValidation.js
module.exports = {
  registerSchema,
  loginSchema,
};