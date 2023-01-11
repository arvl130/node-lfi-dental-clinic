const express = require("express")
const router = express.Router()

const {
  registerAdmin,
  registerPatient,
  updateFullName,
} = require("../controllers/AuthController")

const requirePatientOrAdminToken = require("../middleware/requirePatientOrAdminToken")

router.post("/register/admin", registerAdmin)
router.post("/register", registerPatient)
router.post("/user/name", requirePatientOrAdminToken, updateFullName)

module.exports = router
