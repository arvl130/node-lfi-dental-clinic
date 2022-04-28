const getClosedDates = require("../../helpers/calendar/getClosedSlots");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const startSeconds = req.params.startSeconds;
    const endSeconds = req.params.endSeconds;

    if (!startSeconds)
      throw new HttpError("Missing or invalid start seconds", 400);
    if (!endSeconds) throw new HttpError("Missing or invalid end seconds", 400);

    const closedDates = await getClosedDates(startSeconds, endSeconds);

    res.status(200).json({
      message: "List of dates closed in Unix seconds",
      payload: closedDates,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while getting closed dates",
    });
  }
};
