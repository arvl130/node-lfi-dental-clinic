const getAllMessages = require("../../helpers/getAllMessages");

module.exports = async (req, res) => {
  const messages = await getAllMessages();

  res.status(200).json({
    message: "List of all messages",
    payload: messages,
  });
};
