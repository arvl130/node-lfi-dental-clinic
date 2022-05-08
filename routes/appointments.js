const express = require("express");
const getAllAppointments = require("../controllers/appointments/getAllAppointments");
const router = express.Router();

router.get("/:year/:month", getAllAppointments);

module.exports = router;
