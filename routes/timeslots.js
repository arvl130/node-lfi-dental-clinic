const express = require("express");
const router = express.Router();
const cancelAppointment = require("../controllers/appointments/cancelAppointment");
const newAppointment = require("../controllers/appointments/newAppointment");
const addClosedSlot = require("../controllers/schedules/addClosedSlot");
const deleteClosedSlot = require("../controllers/schedules/deleteClosedSlot");
const getClosedSlots = require("../controllers/schedules/getClosedSlots");
const getUnavailableSlots = require("../controllers/timeslots/getUnavailableSlots");
const requirePatientToken = require("../middleware/requirePatientToken");

/* Admin only */
router.put("/closed", addClosedSlot);
router.delete("/closed/:slotSeconds", deleteClosedSlot);
router.get("/closed/:year/:month", getClosedSlots); // deprecated

/* Anyone */
router.put("/appointments", requirePatientToken, newAppointment);
router.delete(
  "/appointments/:slotSeconds",
  requirePatientToken,
  cancelAppointment
);

router.get("/unavailable/:year/:month", getUnavailableSlots);

module.exports = router;
