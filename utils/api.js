const axios = require("axios");
require("dotenv").config();

const API = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TOKEN}`,
    "Content-Type": "application/json"
  }
});

// 🔹 Fetch depots
const getDepots = async () => {
  const res = await API.get("/depots");
  return res.data;
};

// 🔹 Fetch vehicles
const getVehicles = async () => {
  const res = await API.get("/vehicles");
  return res.data;
};

module.exports = { getDepots, getVehicles };