/*
  Developed By: Elgin
  B.Tech Artificial Intelligence & Machine Learning (2nd Year)
  Project: Full-stack academic project to promote sustainable farming through digitization
*/



import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [loggedInFarmer, setLoggedInFarmer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("farmer");
    if (stored) {
      setLoggedInFarmer(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (farmer) => {
    setLoggedInFarmer(farmer);
    localStorage.setItem("farmer", JSON.stringify(farmer));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            loggedInFarmer ? (
              <Dashboard farmer={loggedInFarmer} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
