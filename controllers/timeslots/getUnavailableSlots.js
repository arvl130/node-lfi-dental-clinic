const getUnavailableSlots = require("../../helpers/calendar/getUnavailableSlots");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const month = req.params.month;
    const year = req.params.year;

    if (!month) throw new HttpError("Missing or invalid month", 400);
    if (!year) throw new HttpError("Missing or invalid year", 400);

    const unavailableSlots = await getUnavailableSlots(year, month);

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
