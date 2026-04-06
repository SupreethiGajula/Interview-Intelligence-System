const express = require("express");
const User = require("../models/Users");
const Candidate = require("../models/Candidate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { registerSchema, loginSchema } = require("../validationSchemas/authValidation");

const router = express.Router();

/* REGISTER USER */
router.post("/register", async (req, res) => {
  try {
    // Trim inputs and validate with Joi
    const inputData = {
      ...req.body,
      name: req.body.name?.trim(),
      email: req.body.email?.trim(),
      password: req.body.password?.trim(),
      targetRole: req.body.targetRole?.trim(),
      experience: req.body.experience
    };

    const { error } = registerSchema.validate(inputData);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role, targetRole, experience } = inputData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      "secretkey",
      { expiresIn: "1d" }
    );

    // If candidate, create Candidate document
    if (role === "candidate") {
      await Candidate.create({
        name,
        email,
        targetRole: targetRole || "",
        experience: Number(experience) || 0,
        dsaScore: 0,
        systemDesignScore: 0,
        projectScore: 0,
        hrScore: 0,
        finalScore: 0,
        status: "Applied"
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      token,
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

/* LOGIN USER */
router.post("/login", async (req, res) => {
  try {
    // Trim inputs and validate with Joi
    const inputData = {
      ...req.body,
      email: req.body.email?.trim(),
      password: req.body.password?.trim()
    };

    const { error } = loginSchema.validate(inputData);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = inputData;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;