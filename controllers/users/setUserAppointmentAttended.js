const HttpError = require("../../helpers/HttpError");
const setUserAppointmentAttended = require("../../helpers/users/setUserAppointmentAttended");

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid;
    const slotSeconds = req.params.slotSeconds;

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400);

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400);

    await setUserAppointmentAttended(patientUid, slotSeconds);

    res.status(200).json({
      message: "User appointment set attended",
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting setting user appointment attended: ${e.message}`,
    });
  }
};
