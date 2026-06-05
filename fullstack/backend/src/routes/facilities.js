const express = require("express");
const facilityController = require("../controllers/facilityController");

const router = express.Router();

router.get("/", facilityController.listFacilities);
router.get("/:id", facilityController.getFacility);

module.exports = router;
