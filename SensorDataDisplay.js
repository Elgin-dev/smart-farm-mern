import React from "react";

const groupByTimestamp = (data) => {
  const grouped = {};

  data.forEach((entry) => {
    const time = new Date(entry.timestamp).toLocaleTimeString();
    if (!grouped[time]) {
      grouped[time] = { time };
    }
    grouped[time][entry.type] = `${entry.value} ${entry.unit}`;
  });

  return Object.values(grouped);
};

const downloadCSV = (groupedData) => {
  const headers = ["Time", "Temperature", "Humidity", "Soil Moisture", "Light Intensity"];
  const rows = groupedData.map((row) => [
    row.time,
    row.temperature || "--",
    row.humidity || "--",
    row.soil || "--",
    row.light || "--",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `sensor_data_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const SensorDataDisplay = ({ data }) => {
  const groupedData = groupByTimestamp(data);
  const latestReading = groupedData[groupedData.length - 1];

  const getAlerts = () => {
    const alerts = [];

    if (latestReading) {
      const soil = parseFloat(latestReading.soil);
      const temp = parseFloat(latestReading.temperature);
      const light = parseFloat(latestReading.light);

      if (soil < 20) alerts.push("⚠️ Soil is too dry! Moisture below 20%");
      if (temp > 38) alerts.push("🔥 Temperature is too high! Above 38°C");
      if (light < 150) alerts.push("🌑 Not enough sunlight! Light < 150 lux");
    }

    return alerts;
  };

  const getRecommendations = () => {
    const recs = [];

    if (latestReading) {
      const soil = parseFloat(latestReading.soil);
      const temp = parseFloat(latestReading.temperature);
      const light = parseFloat(latestReading.light);

      if (soil >= 20 && soil <= 60) recs.push("✅ Soil moisture is optimal.");
      if (temp >= 20 && temp <= 35) recs.push("✅ Temperature is good for crop growth.");
      if (light >= 300 && light <= 800) recs.push("✅ Sufficient sunlight for photosynthesis.");
    }

    return recs;
  };

  const alerts = getAlerts();
  const recommendations = getRecommendations();

  return (
    <div style={{ margin: "20px" }}>
      <h3>📊 Today's Sensor Data</h3>

      {data.length === 0 ? (
        <p>No data available for today.</p>
      ) : (
        <>
          {alerts.length > 0 && (
            <div style={{ background: "#ffe0e0", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
              <strong>⚠️ Alerts:</strong>
              <ul>
                {alerts.map((alert, idx) => (
                  <li key={idx}>{alert}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div style={{ background: "#e0ffe0", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
              <strong>🧠 Smart Recommendations:</strong>
              <ul>
                {recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => downloadCSV(groupedData)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            ⬇️ Download CSV
          </button>

          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Time</th>
                <th>🌡️ Temperature</th>
                <th>💧 Humidity</th>
                <th>🌱 Soil Moisture</th>
                <th>💡 Light Intensity</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.time}</td>
                  <td>{row.temperature || "--"}</td>
                  <td>{row.humidity || "--"}</td>
                  <td>{row.soil || "--"}</td>
                  <td>{row.light || "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default SensorDataDisplay;
