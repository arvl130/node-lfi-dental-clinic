const getClosedSlots = require("../../helpers/calendar/getClosedSlots");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const year = req.params.year;
    const month = req.params.month;

    if (!year) throw new HttpError("Missing or invalid year", 400);
    if (!month) throw new HttpError("Missing or invalid month", 400);

    const closedSlots = await getClosedSlots(year, month);

    res.status(200).json({
      message: "List of dates closed in Unix seconds",
      payload: closedSlots,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while getting closed dates",
    });
  }
};
