const deleteSlotRecord = require("../../helpers/timeslots/deleteSlotRecord");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const slotSeconds = req.params.slotSeconds;

    if (!slotSeconds)
      throw new HttpError(
        `Missing or invalid slot seconds: ${slotSeconds}`,
        400
      );

    await deleteSlotRecord(slotSeconds);

    res.status(200).json({
      message: "Appointment cancelled",
      payload: slotSeconds,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while cancelling appointment: ${e.message}`,
    });
  }
};
