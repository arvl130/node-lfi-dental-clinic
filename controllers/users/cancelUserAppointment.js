const HttpError = require("../../helpers/HttpError")
const cancelAppointment = require("../../helpers/appointments/cancelAppointment")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds

    if (!slotSeconds)
      throw new HttpError(
        `Missing or invalid slot seconds: ${slotSeconds}`,
        400
      )

    await cancelAppointment(patientUid, slotSeconds)

    res.status(200).json({
      message: "Appointment cancelled",
      payload: slotSeconds,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while cancelling appointment: ${e.message}`,
    })
  }
}
