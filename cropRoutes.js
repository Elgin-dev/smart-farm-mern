const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");

// 👉 POST /api/crops
router.post("/", async (req, res) => {
  try {
    const { name, sowDate, reapDate, farmerPhone } = req.body;
    const newCrop = new Crop({ name, sowDate, reapDate, farmerPhone });
    const savedCrop = await newCrop.save();
    res.status(201).json(savedCrop);
  } catch (error) {
    res.status(500).json({ error: "Failed to save crop" });
  }
});

// 🗑️ DELETE /api/crops/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Crop.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Crop not found" });
    }
    res.json({ message: "Crop deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete crop" });
  }
});

module.exports = router;
