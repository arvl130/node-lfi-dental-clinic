const deleteClosedSlot = require("../../helpers/calendar/deleteClosedSlot");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const slotSeconds = req.params.slotSeconds;

    if (!slotSeconds)
      throw new HttpError(
        `Missing or invalid slot seconds: ${slotSeconds}`,
        400
      );

    await deleteClosedSlot(slotSeconds);

    res.status(200).json({
      message: "Closed slot deleted",
      payload: slotSeconds,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while deleting closed dates",
    });
  }
};
