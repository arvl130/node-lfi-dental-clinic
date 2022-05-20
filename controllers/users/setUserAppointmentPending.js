const HttpError = require("../../helpers/HttpError")
const setUserAppointmentPending = require("../../helpers/users/setUserAppointmentPending")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await setUserAppointmentPending(patientUid, slotSeconds)

    res.status(200).json({
      message: "User appointment set attended",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting setting user appointment pending: ${e.message}`,
    })
  }
}
