const express = require("express")
const router = express.Router()

const { cancel, create } = require("../controllers/AppointmentsController")

const {
  addClosed,
  deleteClosed,
  getClosed,
  getUnavailable,
} = require("../controllers/TimeslotsController")

const requirePatientToken = require("../middleware/requirePatientToken")

/* Admin only */
router.put("/closed", addClosed)
router.delete("/closed/:slotSeconds", deleteClosed)
router.get("/closed/:year/:month", getClosed) // deprecated

/* Anyone */
router.put("/appointments", requirePatientToken, create)
router.delete("/appointments/:slotSeconds", requirePatientToken, cancel)

router.get("/unavailable/:year/:month", getUnavailable)

module.exports = router
