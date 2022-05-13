const HttpError = require("../../helpers/HttpError");
const getUserAppointments = require("../../helpers/users/getUserAppointments");

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid;

    if (!patientUid)
      throw new HttpError("Missing or invalid dental history", 400);

    const userAppointments = await getUserAppointments(patientUid);

    res.status(200).json({
      message: "User appointments retrieved",
      payload: userAppointments,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting user appointments: ${e.message}`,
    });
  }
};
