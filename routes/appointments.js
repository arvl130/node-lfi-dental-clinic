const express = require("express")
const router = express.Router()
const {
  getAll,
  getRequestingProcedureAccess,
} = require("../controllers/AppointmentsController")

router.get("/:year/:month", getAll)
router.get("/requesting-procedure-access", getRequestingProcedureAccess)

module.exports = router
