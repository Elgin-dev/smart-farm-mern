import React, { useState, useEffect } from "react";
import { Button, Typography, Box, TextField, Divider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SensorDataDisplay from "./SensorDataDisplay";
import SensorHistoryChart from "./SensorHistoryChart";

function Dashboard({ farmer }) {
  const [showData, setShowData] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cropDetails, setCropDetails] = useState([]);
  const [newCrop, setNewCrop] = useState({ name: "", sowDate: "", reapDate: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // 📥 Load crop details from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`crops-${farmer.phone}`);
    if (saved) setCropDetails(JSON.parse(saved));
  }, [farmer.phone]);

  // 💾 Save crop details when it changes
  useEffect(() => {
    localStorage.setItem(`crops-${farmer.phone}`, JSON.stringify(cropDetails));
  }, [cropDetails, farmer.phone]);

  const handleShowData = async () => {
    try {
      setLoading(true);
      setShowData(false);
      setSensorData([]);

      const res = await fetch(`http://localhost:5000/api/sensors/${farmer.phone}`);
      const data = await res.json();

      const today = new Date().toDateString();
      const filtered = data.filter(
        (entry) => new Date(entry.timestamp).toDateString() === today
      );

      setSensorData(filtered);
      setShowData(true);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      alert("❌ Failed to fetch today's data");
      setLoading(false);
    }
  };

  const handleGenerateData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sensors/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: farmer.name, phone: farmer.phone }),
      });

      const result = await res.json();
      alert("✅ Random data uploaded!");

      setTimeout(() => {
        handleShowData();
      }, 3000);
    } catch (err) {
      console.error("Failed to simulate data:", err);
      alert("❌ Failed to simulate data");
    }
  };

  const handleCropSubmit = () => {
    if (!newCrop.name || !newCrop.sowDate || !newCrop.reapDate) return;

    if (editingIndex !== null) {
      const updated = [...cropDetails];
      updated[editingIndex] = newCrop;
      setCropDetails(updated);
      setEditingIndex(null);
    } else {
      setCropDetails([...cropDetails, newCrop]);
    }

    setNewCrop({ name: "", sowDate: "", reapDate: "" });
  };

  const handleEditCrop = (index) => {
    setNewCrop(cropDetails[index]);
    setEditingIndex(index);
  };

  const handleDeleteCrop = (index) => {
    const updated = cropDetails.filter((_, i) => i !== index);
    setCropDetails(updated);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Welcome, {farmer.name}
      </Typography>
      <Typography gutterBottom>Phone: {farmer.phone}</Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
        <Button variant="contained" onClick={handleGenerateData}>
          🔄 Simulate Sensor Data
        </Button>

        <Button variant="outlined" onClick={handleShowData}>
          📅 Update Today's Data
        </Button>
      </Box>

      {loading && (
        <Typography sx={{ mt: 2, color: "gray" }}>Refreshing data...</Typography>
      )}

      {showData && (
        <Box mt={3}>
          <SensorDataDisplay data={sensorData} />
        </Box>
      )}

      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>🌾 Your Crop Details</Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          label="Crop Name"
          value={newCrop.name}
          onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
        />
        <TextField
          type="date"
          label="Sow Date"
          InputLabelProps={{ shrink: true }}
          value={newCrop.sowDate}
          onChange={(e) => setNewCrop({ ...newCrop, sowDate: e.target.value })}
        />
        <TextField
          type="date"
          label="Reap Date"
          InputLabelProps={{ shrink: true }}
          value={newCrop.reapDate}
          onChange={(e) => setNewCrop({ ...newCrop, reapDate: e.target.value })}
        />
        <Button variant="contained" onClick={handleCropSubmit}>
          {editingIndex !== null ? "Update" : "Add Crop"}
        </Button>
      </Box>

      {cropDetails.length === 0 ? (
        <Typography>No crop data yet.</Typography>
      ) : (
        cropDetails.map((crop, i) => (
          <Box
            key={i}
            border={1}
            borderRadius={2}
            borderColor="gray"
            p={2}
            mb={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography><strong>Crop:</strong> {crop.name}</Typography>
              <Typography><strong>Sowed:</strong> {crop.sowDate}</Typography>
              <Typography><strong>Reap:</strong> {crop.reapDate}</Typography>
            </Box>
            <Box>
              <IconButton onClick={() => handleEditCrop(i)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteCrop(i)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))
      )}

      <Box mt={5}>
        <SensorHistoryChart phone={farmer.phone} />
      </Box>

      <Button
        variant="outlined"
        color="error"
        sx={{ mt: 4 }}
        onClick={() => {
          localStorage.removeItem("farmer");
          window.location.href = "/login";
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Dashboard;
