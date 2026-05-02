const express = require("express");
const { getDepots, getVehicles } = require("./utils/api");
const knapsack = require("./vehicle_maintenance_scheduler/knapsack");
const Log = require("./logging_middleware/logger");

require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/schedule", async (req, res) => {
  try {
    await Log("backend", "info", "controller", "Fetching depots & vehicles");

    const depots = await getDepots();
    const vehicles = await getVehicles();

    console.log("RAW DEPOTS:", depots);
    console.log("RAW VEHICLES:", vehicles);

    // ✅ Normalize depot list
    const depotList = depots?.depots || depots?.data || depots;

    if (!Array.isArray(depotList) || depotList.length === 0) {
      throw new Error("No depots data found");
    }

    // 🔥 FORCE CORRECT EXTRACTION (NO FAIL)
    let maxHours = null;

    const depot = depotList[0];

    if (depot.MechanicHours !== undefined) {
      maxHours = parseInt(depot.MechanicHours);
    } else if (depot.mechanicHours !== undefined) {
      maxHours = parseInt(depot.mechanicHours);
    }

    // 🔴 Debug
    console.log("Extracted maxHours:", maxHours);

    // ✅ VALIDATION
    if (!maxHours || isNaN(maxHours) || maxHours <= 0) {
      throw new Error("Invalid mechanicHours from API");
    }

    // ✅ Normalize vehicle list
    const vehicleList =
      vehicles?.vehicles ||
      vehicles?.data ||
      vehicles;

    if (!Array.isArray(vehicleList) || vehicleList.length === 0) {
      throw new Error("No vehicles data found");
    }

    // ✅ Map tasks safely (handles API casing)
    const tasks = vehicleList.map(v => ({
      taskId: v.taskId || v.TaskID,
      duration: parseInt(v.duration || v.Duration),
      impact: parseInt(v.impact || v.Impact)
    }));

    // ✅ Filter valid tasks
    const validTasks = tasks.filter(
      t =>
        t.duration &&
        t.impact &&
        !isNaN(t.duration) &&
        !isNaN(t.impact) &&
        t.duration > 0 &&
        t.impact > 0
    );

    if (validTasks.length === 0) {
      throw new Error("No valid tasks after filtering");
    }

    console.log("ValidTasks:", validTasks);

    await Log("backend", "info", "service", "Running knapsack");

    const result = knapsack(validTasks, maxHours);

    res.json({
  success: true,
  selectedTasks: result.selectedTasks,
  totalImpact: result.totalImpact,
  totalDuration: result.totalDuration
});

  } catch (err) {
    console.error("ERROR:", err.message);
    await Log("backend", "error", "handler", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});