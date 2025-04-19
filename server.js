const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const sensorRoutes = require("./routes/sensorRoutes");
const farmerRoutes = require("./routes/farmers");
const cropRoutes = require("./routes/cropRoutes"); // ✅ Crop routes import

dotenv.config(); // ✅ Load environment variables

const app = express(); // ✅ Define app before using it
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/sensors", sensorRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/crops", cropRoutes); // ✅ Correct position here

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/SmartFarmingDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🌱 Smart Farming API is running");
});

// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
