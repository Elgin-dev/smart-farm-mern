# 🌱 Sustainable Smart Farming System using MERN Stack

This project is a Smart Farming Web Application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It is designed to help farmers digitally manage sensor data, crop records, and their own profiles through a personalized dashboard. Though real-time sensors are not used in this version due to unavailability, the system simulates realistic sensor data for demo purposes.

---

## 🔧 Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **API Testing:** Postman
- **Other Tools:** Axios, dotenv, CORS, MongoDB Atlas

---

## ✨ Features

- Farmer Registration & Login
- Personalized Dashboards for each farmer
- Add and view crop details
- Simulated sensor data storage and display (Temperature & Humidity)
- RESTful API structure
- Clean and responsive UI

---

## 🚀 How to Run the Project Locally

### Backend (Node.js + Express)

```bash
cd server
npm install
# Create a .env file and add your MongoDB connection string like:
# MONGO_URI=your_mongodb_uri_here
npm start
