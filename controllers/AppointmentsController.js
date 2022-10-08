const HttpError = require("../helpers/HttpError")
const {
  cancel: doCancel,
  create: doCreate,
  getAll: doGetAll,
} = require("../models/Appointments")
const getDateTwoDaysBeforeTimeslot = require("../helpers/conversions/getDateTwoDaysBeforeTimeslot")

async function cancel(req, res) {
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

    await doCancel(patientUid, slotSeconds)

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

async function getAll(req, res) {
  try {
    const month = req.params.month
    const year = req.params.year

    if (!month) throw new HttpError("Missing or invalid month", 400)
    if (!year) throw new HttpError("Missing or invalid year", 400)

    const appointments = await doGetAll(year, month)

    res.status(200).json({
      message: "List of all appointments",
      payload: appointments,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting all appointments: ${e.message}`,
    })
  }
}

async function create(req, res) {
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

    await doCreate(patientUid, slotSeconds, service)

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

module.exports = {
  getAll,
  create,
  cancel,
}
