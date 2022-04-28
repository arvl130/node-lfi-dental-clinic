const express = require("express");
const router = express.Router();

const getClosedSlots = require("../controllers/schedules/getClosedSlots");

router.get("/closed/:startSeconds/:endSeconds", getClosedSlots);

module.exports = router;
