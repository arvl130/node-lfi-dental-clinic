const deleteMessage = require("../../helpers/deleteMessage");

module.exports = async (req, res) => {
  try {
    const uid = req.params.uid;

    if (!uid) {
      const error = new Error("Missing or invalid UID");
      error.httpErrorCode = 400;
      throw error;
    }

    const message = deleteMessage(uid);

    res.status(200).json({
      message: "Message deleted",
      payload: message,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while deleting message",
    });
  }
};
