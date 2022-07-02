const HttpError = require("../../helpers/HttpError")
const cancelAppointment = require("../../helpers/appointments/cancelAppointment")
const getDateTwoDaysBeforeTimeslot = require("../../helpers/conversions/getDateTwoDaysBeforeTimeslot")

module.exports = async (req, res) => {
  try {
    const slotSeconds = req.params.slotSeconds
    const patientUid = req.patientUid

    if (!slotSeconds)
      throw new HttpError(
        `Missing or invalid slot seconds: ${slotSeconds}`,
        400
      )

    const dateTwoDaysBeforeTimeslot = getDateTwoDaysBeforeTimeslot(slotSeconds)

    if (Date.now() > dateTwoDaysBeforeTimeslot.getTime())
      throw new HttpError(`Cancellation period exceeded.`, 400)

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
