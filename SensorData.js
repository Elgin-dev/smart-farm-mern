const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  phone: { type: String, required: true },     // Farmer's phone
  sensor_id: String,                           // Custom ID like 'SM01', 'LUX02'
  type: String,                                // Type: Soil, Light, Temp, etc.
  value: Number,
  unit: String,
  timestamp: { type: Date, default: Date.now },
});

// This will automatically create a collection named 'sensordatas'
module.exports = mongoose.model("SensorData", sensorDataSchema, "sensordatas");
