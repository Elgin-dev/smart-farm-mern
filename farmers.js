// routes/farmers.js
const express = require("express");
const bcrypt = require("bcryptjs");
const Farmer = require("../models/Farmer");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, phone, password, location } = req.body;

  try {
    const existingFarmer = await Farmer.findOne({ phone });
    if (existingFarmer) {
      return res.status(400).json({ message: "Farmer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFarmer = new Farmer({
      name,
      phone,
      password: hashedPassword,
      location,
    });

    await newFarmer.save();

    res.status(201).json({
      message: "Signup successful",
      farmer: {
        _id: newFarmer._id,
        name: newFarmer.name,
        phone: newFarmer.phone,
        location: newFarmer.location,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      farmer: {
        _id: farmer._id,
        name: farmer.name,
        phone: farmer.phone,
        location: farmer.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
