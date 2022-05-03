const getUnavailableSlots = require("../../helpers/calendar/getUnavailableSlots");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const startSeconds = req.params.startSeconds;
    const endSeconds = req.params.endSeconds;

    if (!startSeconds)
      throw new HttpError("Missing or invalid start seconds", 400);
    if (!endSeconds) throw new HttpError("Missing or invalid end seconds", 400);

    const unavailableSlots = await getUnavailableSlots(
      startSeconds,
      endSeconds
    );

    res.status(200).json({
      message: "List of unavailable timeslots",
      payload: unavailableSlots,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting available slots: ${e.message}`,
    });
  }
};
