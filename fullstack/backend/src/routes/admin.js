const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/insights", adminController.getInsights);
router.post("/doctors", adminController.createDoctor);
router.patch("/doctors/:id", adminController.updateDoctor);
router.delete("/doctors/:id", adminController.deleteDoctor);
router.post("/facilities", adminController.createFacility);
router.patch("/facilities/:id", adminController.updateFacility);
router.delete("/facilities/:id", adminController.deleteFacility);

module.exports = router;
