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

const getMedicalChart = require("../controllers/users/charts/getMedicalChart")
const updateMedicalChart = require("../controllers/users/charts/updateMedicalChart")

const getDentalChart = require("../controllers/users/charts/getDentalChart")
const updateDentalChart = require("../controllers/users/charts/updateDentalChart")

const getDeciduousChart = require("../controllers/users/charts/getDeciduousChart")
const updateDeciduousChart = require("../controllers/users/charts/updateDeciduousChart")

const getPatientSignature = require("../controllers/users/signatures/getPatientSignature")
const setPatientSignature = require("../controllers/users/signatures/setPatientSignature")

const getGuardianSignature = require("../controllers/users/signatures/getGuardianSignature")
const setGuardianSignature = require("../controllers/users/signatures/setGuardianSignature")

const getConsentForm = require("../controllers/users/forms/getConsentForm")
const setConsentForm = require("../controllers/users/forms/setConsentForm")

const getAssessmentForm = require("../controllers/users/forms/getAssessmentForm")
const setAssessmentForm = require("../controllers/users/forms/setAssessmentForm")

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
  "/:patientUid/charts/deciduous-chart",
  requireAdminToken,
  getDeciduousChart
)

router.patch(
  "/:patientUid/charts/deciduous-chart",
  requireAdminToken,
  updateDeciduousChart
)

router.get(
  "/:patientUid/signatures/patient",
  requireAdminToken,
  getPatientSignature
)

router.patch(
  "/:patientUid/signatures/patient",
  requireAdminToken,
  setPatientSignature
)

router.get(
  "/:patientUid/signatures/guardian",
  requireAdminToken,
  getGuardianSignature
)

router.patch(
  "/:patientUid/signatures/guardian",
  requireAdminToken,
  setGuardianSignature
)

router.get("/:patientUid/forms/consent", requireAdminToken, getConsentForm)
router.patch("/:patientUid/forms/consent", requireAdminToken, setConsentForm)

router.get(
  "/:patientUid/forms/assessment",
  requireAdminToken,
  getAssessmentForm
)

router.patch(
  "/:patientUid/forms/assessment",
  requireAdminToken,
  setAssessmentForm
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
