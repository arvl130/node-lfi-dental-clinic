const express = require("express");
const router = express.Router();

const updateMedicalChart = require("../controllers/users/updateMedicalChart");
const requirePatientToken = require("../middleware/requirePatientToken");

router.patch(
  "/:patientUid/medicalchart",
  requirePatientToken,
  updateMedicalChart
);

router.get(
  "/:patientUid/medicalchart",
  requirePatientToken,
  updateMedicalChart
);

router.patch(
  "/:patientUid/dentalchart",
  requirePatientToken,
  updateMedicalChart
);

router.get("/:patientUid/dentalchart", requirePatientToken, updateMedicalChart);

router.get(
  "/:patientUid/appointments",
  requirePatientToken,
  updateMedicalChart
);

router.delete(
  "/:patientUid/appointments/:slotSeconds/procedure",
  requirePatientToken,
  updateMedicalChart
);

router.delete(
  "/:patientUid/appointments/:slotSeconds/cancel",
  requirePatientToken,
  updateMedicalChart
);

module.exports = router;
