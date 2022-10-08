const HttpError = require("../helpers/HttpError")
const isDevelopmentEnvironment = require("../helpers/check-environment/isDevelopmentEnvironment")
const getDateTwoDaysBeforeTimeslot = require("../helpers/conversions/getDateTwoDaysBeforeTimeslot")

const {
  getAll: doGetAll,
  getProcedure: doGetProcedure,
  setProcedure: doSetProcedure,
  setAttended: doSetAttended,
  setNotAttended: doSetNotAttended,
  setPending: doSetPending,
} = require("../models/UserAppointments")
const { cancel: doCancel } = require("../models/Appointments")

async function cancel(req, res) {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds

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

async function getProcedure(req, res) {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    const userAppointmentProcedure = await doGetProcedure(
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

async function getAll(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid)
      throw new HttpError("Missing or invalid dental history", 400)

    const userAppointments = await doGetAll(patientUid)

    res.status(200).json({
      message: "User appointments retrieved",
      payload: userAppointments,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting user appointments: ${e.message}`,
    })
  }
}

async function setAttended(req, res) {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await doSetAttended(patientUid, slotSeconds)

    res.status(200).json({
      message: "User appointment set attended",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting setting user appointment attended: ${e.message}`,
    })
  }
}

async function setNotAttended(req, res) {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await doSetNotAttended(patientUid, slotSeconds)

    res.status(200).json({
      message: "User appointment set not attended",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting user appointment not attended: ${e.message}`,
    })
  }
}

async function setPending(req, res) {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await doSetPending(patientUid, slotSeconds)

    res.status(200).json({
      message: "User appointment set attended",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting setting user appointment pending: ${e.message}`,
    })
  }
}

async function setProcedure(req, res) {
  try {
    const patientUid = req.params.patientUid
    const slotSeconds = req.params.slotSeconds
    const procedureBody = req.body.procedureBody

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    if (!procedureBody)
      throw new HttpError("Missing or invalid procedure body", 400)

    await doSetProcedure(patientUid, slotSeconds, procedureBody)

    res.status(200).json({
      message: "User appointment procedure retrieved",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting user appointment procedure: ${e.message}`,
    })
  }
}

module.exports = {
  cancel,
  getAll,
  getProcedure,
  setProcedure,
  setAttended,
  setNotAttended,
  setPending,
}
