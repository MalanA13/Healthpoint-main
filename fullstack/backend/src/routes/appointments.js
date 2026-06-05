const express = require("express");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.get("/", appointmentController.listAppointments);
router.post("/", appointmentController.createAppointment);
router.patch("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
