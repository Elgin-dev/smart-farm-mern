// src/components/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
   Button, Container, TextField, Typography, Paper
} from "@mui/material";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/farmers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Login response:", data); // Debug log

      if (res.ok && data.farmer) {
        localStorage.setItem("farmer", JSON.stringify(data.farmer)); // Optional
        onLogin(data.farmer); // Pass to App.js
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error");
      console.error("Login error:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Farmer Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          New user? <Link to="/signup">Sign up here</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
