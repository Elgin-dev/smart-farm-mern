import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function SensorHistoryChart({ phone }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date().toISOString();

    try {
      const res = await fetch(`http://localhost:5000/api/sensors/history/${phone}?start=${start}&end=${end}`);
      const json = await res.json();

      // group by timestamp
      const grouped = {};
      json.forEach((entry) => {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        if (!grouped[time]) grouped[time] = { time };
        grouped[time][entry.type] = parseFloat(entry.value);
      });

      setData(Object.values(grouped));
    } catch (err) {
      console.error("Chart fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // auto-refresh every 3s
    return () => clearInterval(interval); // cleanup
  }, [phone]);

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>📈 Today's Sensor History</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="🌡️ Temp (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="#00bcd4" name="💧 Humidity (%)" />
          <Line type="monotone" dataKey="soil" stroke="#4caf50" name="🌱 Soil" />
          <Line type="monotone" dataKey="light" stroke="#fdd835" name="💡 Light" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SensorHistoryChart;
