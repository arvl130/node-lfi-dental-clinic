const getAllAppointments = require("../../helpers/appointments/getAllAppointments");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const month = req.params.month;
    const year = req.params.year;

    if (!month) throw new HttpError("Missing or invalid month", 400);
    if (!year) throw new HttpError("Missing or invalid year", 400);

    const appointments = await getAllAppointments(year, month);

    res.status(200).json({
      message: "List of all appointments",
      payload: appointments,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting all appointments: ${e.message}`,
    });
  }
};
