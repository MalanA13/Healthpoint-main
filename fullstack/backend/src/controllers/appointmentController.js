const appointmentModel = require("../models/appointmentModel");
const { predictNoShowWithModel } = require("../services/aiModelClient");

function getAgeGroup(age) {
  if (age <= 12) return "child";
  if (age <= 17) return "teen";
  if (age <= 35) return "young_adult";
  if (age <= 59) return "adult";
  return "senior";
}

function listAppointments(req, res) {
  const appointments = appointmentModel.findAll();
  if (req.user?.role === "admin") {
    return res.json(appointments);
  }
  return res.json(appointments.filter((item) => item.userId === req.user?.sub));
}

async function createAppointment(req, res) {
  const { patientName, gender, age, appointmentDay, waitingDays, neighbourhood, doctorId, facilityId } = req.body;
  if (!patientName || !gender || age === undefined || !appointmentDay) {
    return res.status(400).json({ message: "patientName, gender, age, and appointmentDay are required" });
  }

  if (Number(age) < 0 || Number(age) > 115) {
    return res.status(400).json({ message: "age must be between 0 and 115" });
  }
  if (Number(waitingDays || 0) < 0) {
    return res.status(400).json({ message: "waitingDays cannot be negative" });
  }

  const appointmentDate = new Date(appointmentDay);
  const hypertension = Number(req.body.hypertension || 0);
  const diabetes = Number(req.body.diabetes || 0);
  const alcoholism = Number(req.body.alcoholism || 0);
  const handicap = Number(req.body.handicap || 0);
  const smsReceived = Number(req.body.smsReceived ?? req.body.sms_received ?? 1);
  const hasChronicCondition = Number(
    req.body.hasChronicCondition ?? req.body.has_chronic_condition ?? (hypertension || diabetes ? 1 : 0),
  );
  let riskLevel = req.body.riskLevel;
  let noShowProbability = req.body.noShowProbability;
  let aiSource = "client-supplied";

  if (!riskLevel || noShowProbability === undefined) {
    const risk = await predictNoShowWithModel({
      gender,
      age: Number(age),
      age_group: getAgeGroup(Number(age)),
      neighbourhood: neighbourhood || "Dago",
      scheduled_hour: appointmentDate.getUTCHours(),
      appointment_weekday: appointmentDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
      appointment_month: appointmentDate.getUTCMonth() + 1,
      waiting_days: Number(waitingDays || 0),
      scholarship: Number(req.body.scholarship || 0),
      hypertension,
      diabetes,
      alcoholism,
      handicap,
      sms_received: smsReceived,
      has_chronic_condition: hasChronicCondition,
    });
    riskLevel = risk.risk_level;
    noShowProbability = risk.no_show_probability;
    aiSource = risk.source;
  }

  const appointment = {
    id: `appointment-${Date.now()}`,
    userId: req.user.sub,
    patientName,
    gender,
    age,
    ageGroup: getAgeGroup(Number(age)),
    neighbourhood: neighbourhood || "Dago",
    doctorId: doctorId || "doctor-1",
    facilityId: facilityId || "facility-1",
    appointmentDay,
    waitingDays: Number(waitingDays || 0),
    hypertension,
    diabetes,
    alcoholism,
    handicap,
    smsReceived,
    hasChronicCondition,
    riskLevel,
    noShowProbability,
    aiSource,
    status: "scheduled",
  };

  res.status(201).json(appointmentModel.create(appointment));
}

function updateAppointment(req, res) {
  const appointment = appointmentModel.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "appointment not found" });
  }
  if (req.user?.role !== "admin" && appointment.userId !== req.user?.sub) {
    return res.status(403).json({ message: "You can only update your own appointment" });
  }
  const updated = appointmentModel.update(req.params.id, req.body);
  return res.json(updated);
}

function deleteAppointment(req, res) {
  const appointment = appointmentModel.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "appointment not found" });
  }
  if (req.user?.role !== "admin" && appointment.userId !== req.user?.sub) {
    return res.status(403).json({ message: "You can only delete your own appointment" });
  }
  const deleted = appointmentModel.remove(req.params.id);
  return res.json(deleted);
}

module.exports = {
  createAppointment,
  deleteAppointment,
  listAppointments,
  updateAppointment,
};
