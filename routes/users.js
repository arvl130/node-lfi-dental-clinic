const express = require("express");
const router = express.Router();

const updateMedicalChart = require("../controllers/users/updateMedicalChart");
const requirePatientToken = require("../middleware/requirePatientToken");

router.patch("/medicalchart", requirePatientToken, updateMedicalChart);

module.exports = router;
