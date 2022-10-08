const HttpError = require("../helpers/HttpError")
const {
  getGuardian: doGetGuardian,
  setGuardian: doSetGuardian,
  getPatient: doGetPatient,
  setPatient: doSetPatient,
} = require("../models/UserSignatures")

async function getGuardian(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const guardianSignature = await doGetGuardian(patientUid)

    res.status(200).json({
      message: "Retrieved guardian signature",
      payload: {
        uid: patientUid,
        ...guardianSignature,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting guardian signature: ${e.message}`,
    })
  }
}

async function getPatient(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const patientSignature = await doGetPatient(patientUid)

    res.status(200).json({
      message: "Retrieved patient signature",
      payload: {
        uid: patientUid,
        ...patientSignature,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting patient signature: ${e.message}`,
    })
  }
}

async function setGuardian(req, res) {
  try {
    const patientUid = req.params.patientUid
    const dataUrl = req.body.dataUrl

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!dataUrl) throw new HttpError("Missing or invalid data URL", 400)

    await doSetGuardian(patientUid, dataUrl)

    res.status(200).json({
      message: "Updated guardian signature",
      payload: {
        dataUrl,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while updating guardian signature: ${e.message}`,
    })
  }
}

async function setPatient(req, res) {
  try {
    const patientUid = req.params.patientUid
    const dataUrl = req.body.dataUrl

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!dataUrl) throw new HttpError("Missing or invalid data URL", 400)

    await doSetPatient(patientUid, dataUrl)

    res.status(200).json({
      message: "Updated patient signature",
      payload: {
        dataUrl,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while updating patient signature: ${e.message}`,
    })
  }
}

module.exports = {
  getGuardian,
  setGuardian,
  getPatient,
  setPatient,
}
