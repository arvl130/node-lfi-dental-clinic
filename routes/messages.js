const express = require("express");
const router = express.Router();

const getAllMessages = require("../controllers/messages/getAllMessages");
const deleteMessage = require("../controllers/messages/deleteMessage");

router.get("/", getAllMessages);

router.delete("/:uid/delete", deleteMessage);

module.exports = router;
