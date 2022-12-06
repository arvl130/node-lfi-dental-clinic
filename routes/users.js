const express = require("express")
const router = express.Router()

const requirePatientToken = require("../middleware/requirePatientToken")
const requirePatientOrAdminToken = require("../middleware/requirePatientOrAdminToken")
const requireAdminToken = require("../middleware/requireAdminToken")

const {
  cancel,
  getAll,
  getProcedure,
  setProcedure,
  setAttended,
  setNotAttended,
  setPending,
} = require("../controllers/UserAppointmentsController")
const { create } = require("../controllers/AppointmentsController")

const {
  get: getUser,
  getAnyN: getAnyNUsers,
  getArchivedAnyN: getAnyNArchivedUsers,
  getByName: getUsersByName,
  getArchivedByName: getArchivedUsersByName,
  setArchived,
  setNotArchived,
} = require("../controllers/UsersController")

const {
  getDeciduous,
  setDeciduous,
  getDental,
  setDental,
  getMedical,
  setMedical,
} = require("../controllers/UserChartsController")

const {
  getConsent,
  setConsent,
  getAssessment,
  setAssessment,
} = require("../controllers/UserFormsController")

const {
  getGuardian,
  setGuardian,
  getPatient,
  setPatient,
} = require("../controllers/UserSignaturesController")

/* User info */
router.get("/search/by-name/:nameFilter", requireAdminToken, getUsersByName)
router.get(
  "/archived/search/by-name/:nameFilter",
  requireAdminToken,
  getArchivedUsersByName
)
router.get("/archived", requirePatientOrAdminToken, getAnyNArchivedUsers)
router.post("/:patientUid/archived", requireAdminToken, setArchived)
router.delete("/:patientUid/archived", requireAdminToken, setNotArchived)
router.get("/:patientUid", requirePatientOrAdminToken, getUser)
router.get("/", requireAdminToken, getAnyNUsers)

/* User charts */
router.get(
  "/:patientUid/charts/medical-chart",
  requirePatientOrAdminToken,
  getMedical
)

router.patch(
  "/:patientUid/charts/medical-chart",
  requirePatientOrAdminToken,
  setMedical
)

router.get("/:patientUid/charts/dental-chart", requireAdminToken, getDental)
router.patch("/:patientUid/charts/dental-chart", requireAdminToken, setDental)

router.get(
  "/:patientUid/charts/deciduous-chart",
  requireAdminToken,
  getDeciduous
)

router.patch(
  "/:patientUid/charts/deciduous-chart",
  requireAdminToken,
  setDeciduous
)

/* User signatures */
router.get("/:patientUid/signatures/patient", requireAdminToken, getPatient)
router.patch("/:patientUid/signatures/patient", requireAdminToken, setPatient)
router.get("/:patientUid/signatures/guardian", requireAdminToken, getGuardian)
router.patch("/:patientUid/signatures/guardian", requireAdminToken, setGuardian)

/* User forms */
router.get("/:patientUid/forms/consent", requireAdminToken, getConsent)
router.patch("/:patientUid/forms/consent", requireAdminToken, setConsent)
router.get("/:patientUid/forms/assessment", requireAdminToken, getAssessment)
router.patch("/:patientUid/forms/assessment", requireAdminToken, setAssessment)

/* User appointments */
router.get("/:patientUid/appointments", requirePatientOrAdminToken, getAll)
router.put("/:patientUid/appointments", requirePatientToken, create)

router.put(
  "/:patientUid/appointments/:slotSeconds/attended",
  requireAdminToken,
  setAttended
)

router.patch(
  "/:patientUid/appointments/:slotSeconds/attended",
  requireAdminToken,
  setNotAttended
)

router.delete(
  "/:patientUid/appointments/:slotSeconds/attended",
  requireAdminToken,
  setPending
)

router.get(
  "/:patientUid/appointments/:slotSeconds/procedure",
  requirePatientOrAdminToken,
  getProcedure
)

router.patch(
  "/:patientUid/appointments/:slotSeconds/procedure",
  requireAdminToken,
  setProcedure
)

router.delete(
  "/:patientUid/appointments/:slotSeconds/cancel",
  requirePatientToken,
  cancel
)

module.exports = router
