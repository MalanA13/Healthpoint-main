const medicalRecordModel = require("../models/medicalRecordModel");

function listMedicalRecords(req, res) {
  const userId = req.user?.role === "admin" ? req.query.userId || "user-1" : req.user?.sub;
  res.json(medicalRecordModel.findByUserId(userId));
}

function createMedicalRecord(req, res) {
  const { title, facilityName, date, note } = req.body;
  const userId = req.user?.role === "admin" ? req.body.userId || "user-1" : req.user?.sub;
  if (!title || !facilityName || !date || !note) {
    return res.status(400).json({ message: "title, facilityName, date, and note are required" });
  }

  const record = {
    id: `record-${Date.now()}`,
    userId,
    title,
    facilityName,
    date,
    note,
  };

  res.status(201).json(medicalRecordModel.create(record));
}

function updateMedicalRecord(req, res) {
  const record = medicalRecordModel.findById(req.params.id);
  if (!record) {
    return res.status(404).json({ message: "medical record not found" });
  }
  if (req.user?.role !== "admin" && record.userId !== req.user?.sub) {
    return res.status(403).json({ message: "You can only update your own medical record" });
  }

  const allowed = {};
  ["title", "facilityName", "date", "note"].forEach((key) => {
    if (req.body[key] !== undefined) allowed[key] = req.body[key];
  });
  if (req.user?.role === "admin" && req.body.userId) {
    allowed.userId = req.body.userId;
  }

  const updated = medicalRecordModel.update(req.params.id, allowed);
  return res.json(updated);
}

function deleteMedicalRecord(req, res) {
  const record = medicalRecordModel.findById(req.params.id);
  if (!record) {
    return res.status(404).json({ message: "medical record not found" });
  }
  if (req.user?.role !== "admin" && record.userId !== req.user?.sub) {
    return res.status(403).json({ message: "You can only delete your own medical record" });
  }

  const deleted = medicalRecordModel.remove(req.params.id);
  return res.json(deleted);
}

module.exports = {
  createMedicalRecord,
  deleteMedicalRecord,
  listMedicalRecords,
  updateMedicalRecord,
};
