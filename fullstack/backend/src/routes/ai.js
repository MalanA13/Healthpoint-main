const express = require("express");
const aiController = require("../controllers/aiController");

const router = express.Router();

router.post("/predict-no-show", aiController.predictNoShowRisk);

module.exports = router;
