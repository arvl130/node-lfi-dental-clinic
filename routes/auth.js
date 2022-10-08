const express = require("express")
const router = express.Router()

const {
  registerAdmin,
  registerPatient,
} = require("../controllers/AuthController")

router.post("/register/admin", registerAdmin)
router.post("/register", registerPatient)

module.exports = router
