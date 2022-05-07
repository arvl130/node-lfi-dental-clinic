const express = require("express");
const router = express.Router();

const updateMedicalChart = require("../controllers/users/updateMedicalChart");
const requirePatientToken = require("../middleware/requirePatientToken");

router.patch(
  "/:patientUid/medicalchart",
  requirePatientToken,
  updateMedicalChart
);

module.exports = router;
