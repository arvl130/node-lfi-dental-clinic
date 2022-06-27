const express = require("express")
const router = express.Router()

const requirePatientToken = require("../middleware/requirePatientToken")
const requirePatientOrAdminToken = require("../middleware/requirePatientOrAdminToken")
const requireAdminToken = require("../middleware/requireAdminToken")
const getUserAppointments = require("../controllers/users/getUserAppointments")
const setUserAppointmentAttended = require("../controllers/users/setUserAppointmentAttended")
const setUserAppointmentNotAttended = require("../controllers/users/setUserAppointmentNotAttended")
const setUserAppointmentPending = require("../controllers/users/setUserAppointmentPending")
const getUserAppointmentProcedure = require("../controllers/users/getUserAppointmentProcedure")
const setUserAppointmentProcedure = require("../controllers/users/setUserAppointmentProcedure")

const listUsers = require("../controllers/users/listUsers")
const getUserProfile = require("../controllers/users/getUserProfile")

const getMedicalChart = require("../controllers/users/medical-chart/getMedicalChart")
const updateMedicalChart = require("../controllers/users/updateMedicalChart")

const getDentalChart = require("../controllers/users/dental-chart/getDentalChart")
const updateDentalChart = require("../controllers/users/dental-chart/updateDentalChart")

router.get("/", requireAdminToken, listUsers)
router.get("/:patientUid", requirePatientOrAdminToken, getUserProfile)

router.get(
  "/:patientUid/charts/medical-chart",
  requirePatientOrAdminToken,
  getMedicalChart
)

router.patch(
  "/:patientUid/charts/medical-chart",
  requirePatientOrAdminToken,
  updateMedicalChart
)

router.get(
  "/:patientUid/charts/dental-chart",
  requireAdminToken,
  getDentalChart
)

router.patch(
  "/:patientUid/charts/dental-chart",
  requireAdminToken,
  updateDentalChart
)

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
