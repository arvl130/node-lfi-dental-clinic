const express = require("express");
const cancelAppointment = require("../controllers/appointments/cancelAppointment");
const newAppointment = require("../controllers/appointments/newAppointment");
const addClosedSlot = require("../controllers/schedules/addClosedSlot");
const deleteClosedSlot = require("../controllers/schedules/deleteClosedSlot");
const getClosedSlots = require("../controllers/schedules/getClosedSlots");
const getUnavailableSlots = require("../controllers/timeslots/getUnavailableSlots");
const router = express.Router();

router.get("/closed/:startSeconds/:endSeconds", getClosedSlots);
router.delete("/closed/:slotSeconds", deleteClosedSlot);
router.put("/closed/", addClosedSlot);

router.patch("/appointments/:slotSeconds/cancel", cancelAppointment);
router.put("/appointments", newAppointment);

router.get("/unavailable/:startSeconds/:endSeconds", getUnavailableSlots);

module.exports = router;
