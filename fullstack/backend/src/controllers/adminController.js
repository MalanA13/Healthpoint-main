const { loadDb } = require("../data/store");
const doctorModel = require("../models/doctorModel");
const facilityModel = require("../models/facilityModel");

function ratio(count, total) {
  if (!total) return 0;
  return Number((count / total).toFixed(4));
}

function getInsights(req, res) {
  const { appointments, doctors, facilities } = loadDb();
  const total = appointments.length;
  const scheduled = appointments.filter((item) => item.status === "scheduled").length;
  const completed = appointments.filter((item) => item.status === "completed").length;
  const noShow = appointments.filter((item) => item.status === "no_show").length;
  const highRisk = appointments.filter((item) => item.riskLevel === "High").length;

  const byRisk = appointments.reduce((acc, item) => {
    const key = item.riskLevel || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const byNeighbourhood = Object.entries(
    appointments.reduce((acc, item) => {
      const key = item.neighbourhood || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  res.json({
    totalAppointments: total,
    scheduledAppointments: scheduled,
    completedAppointments: completed,
    noShowAppointments: noShow,
    noShowRate: ratio(noShow, total),
    highRiskAppointments: highRisk,
    highRiskRate: ratio(highRisk, total),
    totalDoctors: doctors.length,
    totalFacilities: facilities.length,
    byRisk,
    byNeighbourhood,
  });
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createDoctor(req, res) {
  const { name, specialization, facilityId } = req.body;
  if (!name || !specialization || !facilityId) {
    return res.status(400).json({ message: "name, specialization, and facilityId are required" });
  }
  const doctor = {
    id: `doctor-${Date.now()}`,
    name,
    specialization,
    facilityId,
    schedule: normalizeList(req.body.schedule),
  };
  return res.status(201).json(doctorModel.create(doctor));
}

function updateDoctor(req, res) {
  const payload = {};
  ["name", "specialization", "facilityId"].forEach((key) => {
    if (req.body[key] !== undefined) payload[key] = req.body[key];
  });
  if (req.body.schedule !== undefined) payload.schedule = normalizeList(req.body.schedule);
  const updated = doctorModel.update(req.params.id, payload);
  if (!updated) return res.status(404).json({ message: "doctor not found" });
  return res.json(updated);
}

function deleteDoctor(req, res) {
  const deleted = doctorModel.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: "doctor not found" });
  return res.json(deleted);
}

function createFacility(req, res) {
  const { name, type, city } = req.body;
  if (!name || !type || !city) {
    return res.status(400).json({ message: "name, type, and city are required" });
  }
  const facility = {
    id: `facility-${Date.now()}`,
    name,
    type,
    city,
    neighbourhood: req.body.neighbourhood || city,
    services: normalizeList(req.body.services),
    distanceKm: Number(req.body.distanceKm || 0),
    latitude: Number(req.body.latitude || 0),
    longitude: Number(req.body.longitude || 0),
  };
  return res.status(201).json(facilityModel.create(facility));
}

function updateFacility(req, res) {
  const payload = {};
  ["name", "type", "city", "neighbourhood"].forEach((key) => {
    if (req.body[key] !== undefined) payload[key] = req.body[key];
  });
  ["distanceKm", "latitude", "longitude"].forEach((key) => {
    if (req.body[key] !== undefined) payload[key] = Number(req.body[key]);
  });
  if (req.body.services !== undefined) payload.services = normalizeList(req.body.services);
  const updated = facilityModel.update(req.params.id, payload);
  if (!updated) return res.status(404).json({ message: "facility not found" });
  return res.json(updated);
}

function deleteFacility(req, res) {
  const deleted = facilityModel.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: "facility not found" });
  return res.json(deleted);
}

module.exports = {
  createDoctor,
  createFacility,
  deleteDoctor,
  deleteFacility,
  getInsights,
  updateDoctor,
  updateFacility,
};
