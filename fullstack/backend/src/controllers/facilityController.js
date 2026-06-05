const facilityModel = require("../models/facilityModel");

function listFacilities(req, res) {
  res.json(facilityModel.findAll());
}

function getFacility(req, res) {
  const facility = facilityModel.findById(req.params.id);
  if (!facility) {
    return res.status(404).json({ message: "facility not found" });
  }
  return res.json(facility);
}

module.exports = {
  getFacility,
  listFacilities,
};
