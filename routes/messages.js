const express = require("express");
const router = express.Router();

const getAllMessages = require("../controllers/messages/getAllMessages");
const deleteMessage = require("../controllers/messages/deleteMessage");
const newMessage = require("../controllers/messages/newMessage");

router.get("/", getAllMessages);
router.put("/", newMessage);
router.delete("/:uid/delete", deleteMessage);

module.exports = router;
