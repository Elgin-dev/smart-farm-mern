// src/components/Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
   Button, Container, TextField, Typography, Paper
} from "@mui/material";

function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/farmers/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        onLogin(data.farmer);
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Farmer Signup
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
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
          <TextField
            label="Location"
            name="location"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Signup;
