const newMessage = require("../../helpers/newMessage");

module.exports = async (req, res) => {
  try {
    const subject = req.body.subject;
    const body = req.body.body;
    const senderName = req.body.senderName;

    if (!subject) {
      const error = new Error("Missing or invalid message subject");
      error.httpErrorCode = 400;
      throw error;
    }

    if (!body) {
      const error = new Error("Missing or invalid message body");
      error.httpErrorCode = 400;
      throw error;
    }

    if (!senderName) {
      const error = new Error("Missing or invalid sender name");
      error.httpErrorCode = 400;
      throw error;
    }

    const message = await newMessage({
      subject,
      body,
      senderName,
    });

    res.status(200).json({
      message: "Message created",
      payload: message,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while creating message",
    });
  }
};
