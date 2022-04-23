const express = require("express");
const getAllMessages = require("../controllers/getAllMessages");
const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await getAllMessages();

  res.status(200).json({
    message: "List of all messages",
    payload: messages,
  });
});

module.exports = router;
