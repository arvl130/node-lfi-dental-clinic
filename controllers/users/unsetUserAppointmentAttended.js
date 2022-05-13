const HttpError = require("../../helpers/HttpError");
const unsetUserAppointmentAttended = require("../../helpers/users/unsetUserAppointmentAttended");

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid;
    const slotSeconds = req.params.slotSeconds;

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400);

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400);

    await unsetUserAppointmentAttended(patientUid, slotSeconds);

    res.status(200).json({
      message: "User appointment set not attended",
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting unsetting user appointment attended: ${e.message}`,
    });
  }
};
