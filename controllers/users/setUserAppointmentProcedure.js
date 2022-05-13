const HttpError = require("../../helpers/HttpError");
const setUserAppointmentProcedure = require("../../helpers/users/setUserAppointmentProcedure");

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid;
    const slotSeconds = req.params.slotSeconds;
    const procedureBody = req.body.procedureBody;

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400);

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400);

    if (!procedureBody)
      throw new HttpError("Missing or invalid procedure body", 400);

    await setUserAppointmentProcedure(patientUid, slotSeconds, procedureBody);

    res.status(200).json({
      message: "User appointment procedure retrieved",
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting user appointment procedure: ${e.message}`,
    });
  }
};
