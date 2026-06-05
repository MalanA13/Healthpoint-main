const express = require("express");
const medicalRecordController = require("../controllers/medicalRecordController");

const router = express.Router();

router.get("/", medicalRecordController.listMedicalRecords);
router.post("/", medicalRecordController.createMedicalRecord);
router.patch("/:id", medicalRecordController.updateMedicalRecord);
router.delete("/:id", medicalRecordController.deleteMedicalRecord);

module.exports = router;
