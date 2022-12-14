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
  cancelRequestProcedureAccess: doCancelProcedureAccess,
  requestProcedureAccess: doRequestProcedureAccess,
  setProcedureAccessAllowed: doSetProcedureAccessAllowed,
  setProcedureAccessDisallowed: doSetProcedureAccessDisallowed,
  setAppointmentPayment: doSetAppointmentPayment,
} = require("../models/UserAppointments")

const {
  cancel: doCancel,
  silentDelete: doSilentDelete,
} = require("../models/Appointments")

async function silentDelete(req, res) {
  try {
    const { patientUid, slotSeconds } = req.params

    if (!patientUid)
      throw new HttpError(`Missing or invalid patient UID: ${patientUid}`, 400)

    if (!slotSeconds)
      throw new HttpError(
        `Missing or invalid slot seconds: ${slotSeconds}`,
        400
      )

    await doSilentDelete(patientUid, slotSeconds)

    res.status(200).json({
      message: "Appointment deleted",
      payload: slotSeconds,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while cancelling appointment: ${e.message}`,
    })
  }
}

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

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

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

async function requestProcedureAccess(req, res) {
  try {
    const { patientUid, slotSeconds } = req.params

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await doRequestProcedureAccess(patientUid, slotSeconds)

    res.status(200).json({
      message: "Requested access to procedure",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while requesting access to procedure: ${e.message}`,
    })
  }
}

async function cancelProcedureAccess(req, res) {
  try {
    const { patientUid, slotSeconds } = req.params

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await doCancelProcedureAccess(patientUid, slotSeconds)

    res.status(200).json({
      message: "Cancelled request to access procedure",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while cancelling request to access procedure: ${e.message}`,
    })
  }
}

async function setProcedureAccessAllowed(req, res) {
  try {
    const { patientUid, slotSeconds } = req.params

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await doSetProcedureAccessAllowed(patientUid, slotSeconds)

    res.status(200).json({
      message: "Procedure access allowed",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while allowing procedure access: ${e.message}`,
    })
  }
}

async function setProcedureAccessDisallowed(req, res) {
  try {
    const { patientUid, slotSeconds } = req.params

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await doSetProcedureAccessDisallowed(patientUid, slotSeconds)

    res.status(200).json({
      message: "Procedure access disallowed",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while disallowing procedure access: ${e.message}`,
    })
  }
}

async function setAppointmentPayment(req, res) {
  try {
    const { patientUid, slotSeconds } = req.params
    const { price, amountPaid, status } = req.body

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    if (!isFinite(price) || isNaN(price))
      throw new HttpError("Missing or invalid price", 400)

    if (!isFinite(amountPaid) || isNaN(amountPaid))
      throw new HttpError("Missing or invalid amount paid", 400)

    if (!status === undefined)
      throw new HttpError("Missing or invalid status", 400)

    await doSetAppointmentPayment(
      patientUid,
      slotSeconds,
      price,
      amountPaid,
      status
    )

    res.status(200).json({
      message: "Appointment payment set",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while setting appointment payment: ${e.message}`,
    })
  }
}

module.exports = {
  cancel,
  silentDelete,
  getAll,
  getProcedure,
  setProcedure,
  setAttended,
  setNotAttended,
  setPending,
  requestProcedureAccess,
  cancelProcedureAccess,
  setProcedureAccessAllowed,
  setProcedureAccessDisallowed,
  setAppointmentPayment,
}
