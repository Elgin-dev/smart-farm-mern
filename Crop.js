const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sowDate: { type: String, required: true },
  reapDate: { type: String, required: true },
  farmerPhone: { type: String, required: true }
});

// ✅ Force collection name to "Crops"
module.exports = mongoose.model("Crop", cropSchema, "Crops");
