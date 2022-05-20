const express = require("express")
const router = express.Router()

const updateMedicalChart = require("../controllers/users/updateMedicalChart")
const getUserProfile = require("../controllers/users/getUserProfile")
const listUsers = require("../controllers/users/listUsers")
const requirePatientToken = require("../middleware/requirePatientToken")
const requirePatientOrAdminToken = require("../middleware/requirePatientOrAdminToken")
const requireAdminToken = require("../middleware/requireAdminToken")
const getUserAppointments = require("../controllers/users/getUserAppointments")
const setUserAppointmentAttended = require("../controllers/users/setUserAppointmentAttended")
const setUserAppointmentNotAttended = require("../controllers/users/setUserAppointmentNotAttended")
const setUserAppointmentPending = require("../controllers/users/setUserAppointmentPending")
const getUserAppointmentProcedure = require("../controllers/users/getUserAppointmentProcedure")
const setUserAppointmentProcedure = require("../controllers/users/setUserAppointmentProcedure")
const getMedicalChart = require("../controllers/users/medical-chart/getMedicalChart")

router.get("/", requireAdminToken, listUsers)

router.get("/:patientUid", requirePatientOrAdminToken, getUserProfile)

router.get(
  "/:patientUid/appointments",
  requirePatientOrAdminToken,
  getUserAppointments
)

router.put(
  "/:patientUid/appointments/:slotSeconds/attended",
  requireAdminToken,
  setUserAppointmentAttended
)

router.patch(
  "/:patientUid/appointments/:slotSeconds/attended",
  requireAdminToken,
  setUserAppointmentNotAttended
)

router.delete(
  "/:patientUid/appointments/:slotSeconds/attended",
  requireAdminToken,
  setUserAppointmentPending
)

router.get(
  "/:patientUid/appointments/:slotSeconds/procedure",
  requireAdminToken,
  getUserAppointmentProcedure
)

router.patch(
  "/:patientUid/appointments/:slotSeconds/procedure",
  requireAdminToken,
  setUserAppointmentProcedure
)

router.patch(
  "/:patientUid/medicalchart",
  requirePatientOrAdminToken,
  updateMedicalChart
)

router.get(
  "/:patientUid/medicalchart",
  requirePatientOrAdminToken,
  getMedicalChart
)

router.patch(
  "/:patientUid/dentalchart",
  requirePatientToken,
  updateMedicalChart
)

router.get("/:patientUid/dentalchart", requirePatientToken, updateMedicalChart)

router.delete(
  "/:patientUid/appointments/:slotSeconds/procedure",
  requirePatientToken,
  updateMedicalChart
)

router.delete(
  "/:patientUid/appointments/:slotSeconds/cancel",
  requirePatientToken,
  updateMedicalChart
)

module.exports = router
