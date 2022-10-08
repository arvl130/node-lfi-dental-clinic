const express = require("express")
const router = express.Router()
const { getAll } = require("../controllers/AppointmentsController")

router.get("/:year/:month", getAll)

module.exports = router
