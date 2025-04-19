const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");

// ✅ Get all sensor data for a specific phone
router.get("/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const data = await SensorData.find({ phone }).sort({ timestamp: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sensor data", details: err.message });
  }
});

// ✅ Add simulated sensor data (random values)
router.post("/add", async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required" });
  }

  // 🔁 Generate random sensor data
  const sensorTypes = [
    { type: "temperature", value: Number((20 + Math.random() * 15).toFixed(2)), unit: "°C" },
    { type: "humidity", value: Number((30 + Math.random() * 40).toFixed(2)), unit: "%" },
    { type: "soil", value: Number((10 + Math.random() * 60).toFixed(2)), unit: "%" },
    { type: "light", value: Number((100 + Math.random() * 900).toFixed(2)), unit: "lux" },
  ];

  try {
    const sensorEntries = sensorTypes.map((sensor) => ({
      name,
      phone,
      type: sensor.type,
      value: sensor.value,
      unit: sensor.unit,
    }));

    const savedEntries = await SensorData.insertMany(sensorEntries);

    res.status(201).json({
      message: "✅ Random sensor data stored successfully",
      data: savedEntries,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add sensor data", details: err.message });
  }
});

// ✅ Get historical sensor data (by phone and time range)
router.get("/history/:phone", async (req, res) => {
  const { phone } = req.params;
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Start and end date required" });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  try {
    const data = await SensorData.find({
      phone,
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch historical data", details: err.message });
  }
});

module.exports = router;
