const doctorModel = require("../models/doctorModel");

function listDoctors(req, res) {
  res.json(doctorModel.findAll());
}

function getDoctor(req, res) {
  const doctor = doctorModel.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: "doctor not found" });
  }
  return res.json(doctor);
}

module.exports = {
  getDoctor,
  listDoctors,
};
