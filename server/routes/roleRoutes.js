const express = require("express");
const router = express.Router();
const RoleWeight = require("../models/RoleWeight");

// create role weights
router.post("/", async (req, res) => {
    try {

        const role = new RoleWeight(req.body);
        const savedRole = await role.save();

        res.status(201).json(savedRole);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get all roles
router.get("/", async (req, res) => {
    try {

        const roles = await RoleWeight.find();
        res.json(roles);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;