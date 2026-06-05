const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const doctorRoutes = require("./routes/doctors");
const facilityRoutes = require("./routes/facilities");
const aiRoutes = require("./routes/ai");
const adminRoutes = require("./routes/admin");
const medicalRecordRoutes = require("./routes/medicalRecords");
const { adminMiddleware, authMiddleware } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "HealPoint API Service is active",
    endpoints: {
      health: "/api/health"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "healpoint-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/appointments", authMiddleware, appointmentRoutes);
app.use("/api/admin", authMiddleware, adminMiddleware, adminRoutes);
app.use("/api/medical-records", authMiddleware, medicalRecordRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
