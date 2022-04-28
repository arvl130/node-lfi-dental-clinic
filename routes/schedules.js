const express = require("express");
const addClosedSlot = require("../controllers/schedules/addClosedSlot");
const deleteClosedSlot = require("../controllers/schedules/deleteClosedSlot");
const getClosedSlots = require("../controllers/schedules/getClosedSlots");
const router = express.Router();

router.get("/closed/:startSeconds/:endSeconds", getClosedSlots);
router.put("/closed/", addClosedSlot);
router.delete("/closed/:slotSeconds", deleteClosedSlot);

module.exports = router;
