const newAppointment = require("../../helpers/appointments/newAppointment")
const HttpError = require("../../helpers/HttpError")

module.exports = async (req, res) => {
  try {
    const slotSeconds = req.body.slotSeconds
    const service = req.body.service
    const patientUid = req.body.patientUid

    if (!slotSeconds)
      throw new HttpError(
        `Missing or invalid slot seconds: ${slotSeconds}`,
        400
      )

    if (!patientUid)
      throw new HttpError(`Missing or invalid patient UID: ${patientUid}`, 400)

    if (isNaN(parseInt(slotSeconds)))
      throw new HttpError(`Slot seconds is non-numeric: ${slotSeconds}`, 400)

    if (!service)
      throw new HttpError(`Missing or invalid service: ${service}`, 400)

    await newAppointment(patientUid, slotSeconds, service)

    res.status(200).json({
      message: "New appointment created",
      payload: slotSeconds,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while creating new appointment: ${e.message}`,
    })
  }
}
