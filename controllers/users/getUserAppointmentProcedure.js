const HttpError = require("../../helpers/HttpError")
const getUserAppointmentProcedure = require("../../helpers/users/getUserAppointmentProcedure")
const isDevelopmentEnvironment = require("../../helpers/check-environment/isDevelopmentEnvironment")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    const userAppointmentProcedure = await getUserAppointmentProcedure(
      patientUid,
      slotSeconds
    )

    // Reject access to non-admin users if procedure visibility
    // is not yet approved.
    if (!isDevelopmentEnvironment()) {
      if (
        req.accountType !== "admin" &&
        userAppointmentProcedure.procedureVisible !== true
      )
        throw new HttpError("Unauthorized request", 401)
    }

    res.status(200).json({
      message: "User appointment procedure retrieved",
      payload: userAppointmentProcedure,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting user appointment procedure: ${e.message}`,
    })
  }
}
